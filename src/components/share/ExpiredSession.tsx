import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

export const ExpiredSession: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Clock className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Session Expired
        </h2>
        <p className="text-gray-600 mb-6">
          This shared chat session has expired or is no longer available.
        </p>
        <Link
          to="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Sign in to create a new session
        </Link>
      </div>
    </div>
  );
};