
import React from 'react';
import { HighlightedContent, HighlightType } from '../types';

interface DocumentViewerProps {
  content: HighlightedContent[];
  fileName: string;
}

const HIGHLIGHT_COLORS: Record<HighlightType, string> = {
  [HighlightType.Risky]: 'bg-red-900/50 border-l-4 border-red-500',
  [HighlightType.Payment]: 'bg-blue-900/50 border-l-4 border-blue-500',
  [HighlightType.Deadline]: 'bg-green-900/50 border-l-4 border-green-500',
  [HighlightType.Confidentiality]: 'bg-yellow-900/50 border-l-4 border-yellow-500',
  [HighlightType.Normal]: 'border-l-4 border-transparent',
};

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, fileName }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-inner h-full flex flex-col">
       <h2 className="text-xl font-semibold text-white p-4 border-b border-gray-700 flex-shrink-0">
        {fileName}
      </h2>
      <div className="prose prose-invert max-w-none p-6 text-gray-300 overflow-y-auto flex-grow">
        {content.map((item, index) => (
          <p key={index} className={`my-2 p-3 rounded-md transition-colors duration-200 ${HIGHLIGHT_COLORS[item.type]}`}>
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer;
