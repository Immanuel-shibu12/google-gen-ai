
import { AnalysisResult, HighlightedContent, HighlightType } from '../types';

// This is a mock service to simulate backend and Gemini API calls.
// In a real application, this would make network requests.

const MOCK_ANALYSIS: AnalysisResult = {
  riskScore: 8,
  riskExplanation:
    'The termination clause is heavily one-sided, allowing one party to terminate without notice. Additionally, the penalty for late payment is unusually high at 30%.',
  suggestions: [
    'Negotiate to add a 30-day notice period for termination.',
    'Propose a more standard late payment penalty, such as 5-10%.',
    'Clarify the confidentiality terms to specify what information is covered.',
  ],
  highlightedContent: [
    {
      text: 'This Rental Agreement is made and entered into on this 1st day of January, 2024, by and between Landlord, and Tenant. ',
      type: HighlightType.Normal,
    },
    {
      text: 'The Tenant agrees to pay a monthly rent of ₹10,00,000. Payment is due on the 1st of each month. ',
      type: HighlightType.Payment,
    },
    {
      text: 'Failure to pay within 5 days of the due date will result in a 30% penalty. ',
      type: HighlightType.Risky,
    },
    {
      text: 'This agreement will automatically renew unless notice is given by the tenant 60 days before the end of the term. ',
      type: HighlightType.Deadline,
    },
    {
      text: 'The Landlord reserves the right to terminate this agreement at any time, for any reason, without prior notice. ',
      type: HighlightType.Risky,
    },
    {
      text: 'All terms of this agreement, including financial details, shall be kept confidential by both parties. ',
      type: HighlightType.Confidentiality,
    },
    {
      text: 'The Tenant is responsible for all repairs and maintenance of the property.',
      type: HighlightType.Normal,
    },
  ],
};

export const analyzeDocument = (
  fileContent: string,
  language: string
): Promise<AnalysisResult> => {
  console.log(`Analyzing document with content length: ${fileContent.length} for output in ${language}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ANALYSIS);
    }, 2500); // Simulate network delay
  });
};

export const chatWithDocument = (
  message: string,
  context: HighlightedContent[]
): Promise<string> => {
  console.log(`Chatting with message: "${message}" and document context.`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('penalty')) {
        resolve(
          'The penalty for late payment is 30%, which is considered very high. This is highlighted in red as a risky clause. It is recommended to negotiate this down to a more standard rate like 5-10%.'
        );
      } else if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
        resolve(
          "This document outlines a rental agreement with a monthly payment of ₹10,00,000. Key risks include a harsh 30% late payment penalty and a one-sided termination clause allowing the landlord to end the agreement without notice. It's recommended to revise these terms."
        );
      } else if (lowerMessage.includes('termination')) {
         resolve(
          'The termination clause is highly risky. It states: "The Landlord reserves the right to terminate this agreement at any time, for any reason, without prior notice." You should strongly consider negotiating for a clause that requires a minimum notice period, such as 30 or 60 days.'
        );
      }
      else {
        resolve(
          "I'm here to help you with this legal document. You can ask me to summarize clauses, explain risks, or clarify specific terms."
        );
      }
    }, 1500); // Simulate AI thinking delay
  });
};
