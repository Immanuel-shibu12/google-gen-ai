import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisSidebarProps {
  result: AnalysisResult;
  fileName: string | null;
}

const RiskScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const color =
    score >= 8
      ? 'text-red-500'
      : score >= 5
      ? 'text-yellow-500'
      : 'text-green-500';

  const riskLabel =
    score >= 8
      ? 'High Risk'
      : score >= 5
      ? 'Medium Risk'
      : 'Low Risk';

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900/50 rounded-lg">
      <div className={`text-6xl font-bold ${color}`}>{score}<span className="text-3xl text-gray-400">/10</span></div>
      <div className={`text-lg font-semibold ${color}`}>{riskLabel}</div>
    </div>
  );
};

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
    >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


const AnalysisSidebar: React.FC<AnalysisSidebarProps> = ({ result, fileName }) => {
  const handleExport = () => {
    if (!result || !fileName) return;

    let exportContent = `Analysis for: ${fileName}\n\n`;
    exportContent += `========================\n`;
    exportContent += `  RISK ANALYSIS SUMMARY \n`;
    exportContent += `========================\n\n`;
    exportContent += `RISK SCORE: ${result.riskScore}/10\n`;
    exportContent += `EXPLANATION: ${result.riskExplanation}\n\n`;
    exportContent += `SMART SUGGESTIONS:\n${result.suggestions.map(s => `  - ${s}`).join('\n')}\n\n`;
    exportContent += `========================\n`;
    exportContent += `   HIGHLIGHTED DOCUMENT   \n`;
    exportContent += `========================\n\n`;

    result.highlightedContent.forEach(item => {
      exportContent += `[${item.type.toUpperCase()}]\n${item.text.trim()}\n\n`;
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    link.download = `analysis-${baseName}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Risk Score</h3>
        <RiskScoreGauge score={result.riskScore} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Explanation</h3>
        <p className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded-md">
          {result.riskExplanation}
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Smart Suggestions</h3>
        <ul className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-green-500 mr-3 mt-1">&#10003;</span>
              <span className="text-gray-300">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
       <div>
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">Actions</h3>
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700"
          aria-label="Export Analysis as Text File"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Export Analysis
        </button>
      </div>
       <div>
        <h3 className="text-lg font-semibold text-white mb-3 mt-6">Highlight Legend</h3>
        <ul className="space-y-2 text-sm">
           <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span> Risky Clauses</li>
           <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span> Payment Terms</li>
           <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span> Deadlines & Dates</li>
           <li className="flex items-center"><span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span> Confidentiality</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisSidebar;