import React, { useState, useCallback } from 'react';
import { AnalysisResult, ChatMessage } from './types';
import { analyzeDocument, chatWithDocument } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisSidebar from './components/AnalysisSidebar';
import DocumentViewer from './components/DocumentViewer';
import Chatbot from './components/Chatbot';

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileAnalysis = useCallback(async (file: File, language: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setChatHistory([]);
    setFileName(file.name);

    try {
      // Simulate reading file content
      const fileContent = await file.text();
      const result = await analyzeDocument(fileContent, language);
      setAnalysis(result);
      setChatHistory([
        {
          sender: 'ai',
          text: `Hello! I've analyzed your document, "${file.name}". You can see a summary on the right. How can I help you understand it better?`,
        },
      ]);
    } catch (e) {
      setError('Failed to analyze the document. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!analysis) return;

    const updatedHistory: ChatMessage[] = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(updatedHistory);
    setIsChatting(true);

    try {
      const aiResponse = await chatWithDocument(message, analysis.highlightedContent);
      setChatHistory([...updatedHistory, { sender: 'ai', text: aiResponse }]);
    } catch (e) {
      console.error(e);
      setChatHistory([
        ...updatedHistory,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsChatting(false);
    }
  }, [chatHistory, analysis]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col md:flex-row h-full">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
            {!analysis && !isLoading && <FileUpload onAnalyze={handleFileAnalysis} />}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg">Analyzing your document...</p>
                <p className="text-sm mt-1">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full text-red-400">
                <p>{error}</p>
              </div>
            )}
            {analysis && !isLoading && (
              <DocumentViewer content={analysis.highlightedContent} fileName={fileName || 'Document'} />
            )}
          </div>

          {/* Sidebar */}
          {analysis && !isLoading && (
            <div className="w-full md:w-96 bg-gray-800 border-l border-gray-700 p-4 md:p-6 overflow-y-auto flex-shrink-0">
              <AnalysisSidebar result={analysis} fileName={fileName} />
            </div>
          )}
        </div>
      </main>
      {analysis && !isLoading && (
        <Chatbot
          history={chatHistory}
          onSendMessage={handleSendMessage}
          isSending={isChatting}
        />
      )}
    </div>
  );
}