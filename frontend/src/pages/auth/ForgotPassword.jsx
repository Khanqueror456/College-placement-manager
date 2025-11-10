import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../../services/authService';

// SVG Icon for Email
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

// SVG Icon for Back Arrow
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

// SVG Icon for Lock Reset
const LockResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-sky-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email Required', {
        description: 'Please enter your email address.'
      });
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);
      
      setEmailSent(true);
      toast.success('Email Sent Successfully!', {
        description: 'Please check your inbox for password reset instructions.',
        duration: 5000
      });
      
    } catch {
      // Even on error, show generic message for security
      setEmailSent(true);
      toast.info('Request Processed', {
        description: 'If an account exists with this email, you will receive a password reset link.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-8">
      <div className="w-full max-w-md relative">
        {/* Back to Login Button */}
        <Link
          to="/login"
          className="
            absolute -top-4 -left-4 md:-top-5 md:-left-5 z-10 p-2.5 rounded-full
            text-slate-300 bg-slate-700 bg-opacity-50
            border border-slate-500 border-opacity-30
            hover:bg-opacity-100 hover:text-sky-400 hover:border-sky-400
            transition-all duration-200
          "
          aria-label="Back to login"
        >
          <BackArrowIcon />
        </Link>

        {/* Glass-Morphism Card */}
        <div className="
          w-full p-8
          bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-xl 
          rounded-xl shadow-2xl shadow-slate-900/50 
          border border-slate-500 border-opacity-30 text-slate-200 
        ">
          
          {!emailSent ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <LockResetIcon />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-extrabold mb-2 text-center text-slate-100">
                Forgot Password?
              </h2>
              
              <p className="text-center text-slate-300 mb-6 text-sm">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <EmailIcon />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-500 border-opacity-50
                                 bg-slate-800 bg-opacity-30 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-sky-400 
                                 transition duration-300 text-slate-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-lg font-semibold
                             bg-sky-500 text-white
                             hover:bg-sky-400 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {/* Additional Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="font-bold text-sky-400 hover:text-sky-300 transition duration-300"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-green-500 bg-opacity-20 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-green-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold mb-4 text-slate-100">
                  Check Your Email
                </h2>
                
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  We've sent password reset instructions to <strong className="text-sky-400">{email}</strong>.
                  <br />
                  <br />
                  Please check your inbox and follow the link to reset your password.
                  The link will expire in <strong>15 minutes</strong> for security reasons.
                </p>

                <div className="bg-slate-800 bg-opacity-30 rounded-lg p-4 mb-6 border border-slate-600 border-opacity-30">
                  <p className="text-xs text-slate-400 mb-2">
                    📧 <strong>Didn't receive the email?</strong>
                  </p>
                  <ul className="text-xs text-slate-400 text-left space-y-1 pl-4">
                    <li>• Check your spam or junk folder</li>
                    <li>• Verify the email address is correct</li>
                    <li>• Wait a few minutes for the email to arrive</li>
                    <li>• Try requesting another reset link</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full py-3 rounded-lg text-lg font-semibold
                             bg-slate-700 bg-opacity-50 text-slate-200
                             hover:bg-opacity-70 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
                             border border-slate-500 border-opacity-30"
                >
                  Send Another Email
                </button>

                <div className="mt-6">
                  <Link 
                    to="/login" 
                    className="text-sm font-bold text-sky-400 hover:text-sky-300 transition duration-300"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>
            🔒 This is a secure password reset process.
            <br />
            Your password will never be sent via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
