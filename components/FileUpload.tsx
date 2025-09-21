
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { SUPPORTED_LANGUAGES } from '../constants';

interface FileUploadProps {
  onAnalyze: (file: File, language: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('en');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // Simple validation for file type. Can be expanded.
      if (['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type) || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Unsupported file type. Please upload PDF, DOCX, or TXT.');
        setFile(null);
      }
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, over: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(over);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleAnalyzeClick = useCallback(() => {
    if (file) {
      onAnalyze(file, language);
    }
  }, [file, language, onAnalyze]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 p-8 text-center">
      <div 
        className={`w-full max-w-lg p-10 border-2 border-dashed rounded-lg transition-colors duration-300 ${isDragOver ? 'border-blue-500 bg-gray-800' : 'border-gray-600 hover:border-blue-600'}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
      >
        <UploadIcon className="mx-auto h-16 w-16 text-gray-500" />
        <p className="mt-4 text-lg text-gray-300">
          Drag & drop your contract here
        </p>
        <p className="text-gray-500">or</p>
        <label
          htmlFor="file-upload"
          className="mt-2 inline-block cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Browse File
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          onChange={(e) => handleFileChange(e.target.files)}
          accept=".pdf,.docx,.txt"
        />
        {file && (
          <p className="mt-4 text-sm text-green-400">
            Selected: {file.name}
          </p>
        )}
        {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
        )}
      </div>

      <div className="mt-8 w-full max-w-lg">
        <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-2">
          Select Output Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAnalyzeClick}
        disabled={!file}
        className="mt-8 w-full max-w-lg rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Analyze Document
      </button>
    </div>
  );
};

export default FileUpload;
