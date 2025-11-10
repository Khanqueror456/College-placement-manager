import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../../services/authService';

// SVG Icon for Lock
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

// SVG Icon for Eye (Show Password)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// SVG Icon for Eye Slash (Hide Password)
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// SVG Icon for Check Circle
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Required Fields', {
        description: 'Please fill in all password fields.'
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password Too Short', {
        description: 'Password must be at least 6 characters long.'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords Do Not Match', {
        description: 'Please make sure both passwords are identical.'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.password, formData.confirmPassword);
      
      setResetSuccess(true);
      toast.success('Password Reset Successful!', {
        description: 'You can now login with your new password.',
        duration: 5000
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error('Reset Failed', {
        description: errorMessage,
        duration: 6000
      });

      // If token is invalid or expired, redirect to forgot password after 2 seconds
      if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('expired')) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-8">
      <div className="w-full max-w-md">
        {/* Glass-Morphism Card */}
        <div className="
          w-full p-8
          bg-slate-700 bg-opacity-20 backdrop-filter backdrop-blur-xl 
          rounded-xl shadow-2xl shadow-slate-900/50 
          border border-slate-500 border-opacity-30 text-slate-200 
        ">
          
          {!resetSuccess ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-sky-500 bg-opacity-20 p-4">
                  <LockIcon />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-sky-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-extrabold mb-2 text-center text-slate-100">
                Reset Password
              </h2>
              
              <p className="text-center text-slate-300 mb-6 text-sm">
                Please enter your new password below.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* New Password Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LockIcon />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-500 border-opacity-50
                                 bg-slate-800 bg-opacity-30 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-sky-400 
                                 transition duration-300 text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LockIcon />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-500 border-opacity-50
                                 bg-slate-800 bg-opacity-30 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-sky-400 
                                 transition duration-300 text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                <div className="mb-6 bg-slate-800 bg-opacity-30 rounded-lg p-4 border border-slate-600 border-opacity-30">
                  <p className="text-xs text-slate-300 mb-2 font-semibold">Password Requirements:</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li className={formData.password.length >= 6 ? 'text-green-400' : ''}>
                      • At least 6 characters {formData.password.length >= 6 && '✓'}
                    </li>
                    <li className={formData.password && formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-green-400' : ''}>
                      • Passwords match {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && '✓'}
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-lg font-semibold
                             bg-emerald-500 text-slate-900
                             hover:bg-emerald-400 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    'Reset Password'
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
                    <CheckCircleIcon />
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold mb-4 text-slate-100">
                  Password Reset Successfully!
                </h2>
                
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  Your password has been reset successfully.
                  <br />
                  <br />
                  You will be redirected to the login page shortly...
                </p>

                <Link
                  to="/login"
                  className="inline-block w-full py-3 rounded-lg text-lg font-semibold
                             bg-sky-500 text-white
                             hover:bg-sky-400 transition duration-300
                             focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>
            🔒 For your security, this reset link can only be used once.
            <br />
            The link expires 15 minutes after it was sent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
