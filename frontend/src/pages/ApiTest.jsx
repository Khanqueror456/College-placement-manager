import React, { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * API Connection Test Component
 * Tests backend connectivity and displays server status
 */
const ApiTest = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    serverInfo: null,
    error: null
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus({ loading: true, connected: false, serverInfo: null, error: null });
    
    try {
      // Test basic API endpoint
      const response = await api.get('/health');
      
      if (response.data.success) {
        setStatus({
          loading: false,
          connected: true,
          serverInfo: response.data,
          error: null
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        serverInfo: null,
        error: error.message || 'Failed to connect to server'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Backend Connection Test
          </h2>
          
          {status.loading && (
            <div className="text-slate-300">
              <div className="animate-pulse">Testing connection...</div>
            </div>
          )}

          {!status.loading && status.connected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Connected Successfully!</span>
              </div>
              
              <div className="bg-slate-700 rounded p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Server Information</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div><span className="font-semibold">Message:</span> {status.serverInfo.message}</div>
                  <div><span className="font-semibold">Environment:</span> {status.serverInfo.environment}</div>
                  <div><span className="font-semibold">Database:</span> {status.serverInfo.database}</div>
                  <div><span className="font-semibold">Timestamp:</span> {status.serverInfo.timestamp}</div>
                </div>
              </div>
            </div>
          )}

          {!status.loading && !status.connected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-semibold">Connection Failed</span>
              </div>
              
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded p-4">
                <p className="text-red-300 text-sm">{status.error}</p>
              </div>

              <div className="bg-slate-700 rounded p-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Troubleshooting</h3>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                  <li>Ensure backend server is running on port 3000</li>
                  <li>Check if PostgreSQL database is connected</li>
                  <li>Verify CORS settings in backend config</li>
                  <li>Check browser console for detailed errors</li>
                </ul>
              </div>
            </div>
          )}

          <button
            onClick={testConnection}
            disabled={status.loading}
            className="mt-4 w-full py-2 px-4 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 
                     text-white font-semibold rounded transition-colors duration-200"
          >
            {status.loading ? 'Testing...' : 'Test Again'}
          </button>
        </div>

        <div className="mt-6 bg-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Quick Links</h3>
          <div className="space-y-2">
            <a href="/login" className="block text-sky-400 hover:text-sky-300 transition-colors">
              → Go to Login Page
            </a>
            <a href="http://localhost:3000/health" target="_blank" rel="noopener noreferrer" 
               className="block text-sky-400 hover:text-sky-300 transition-colors">
              → View Backend Health (Direct)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
