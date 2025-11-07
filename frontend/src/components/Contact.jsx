import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

// Import shared components
import Navbar from './Navbar';
import Footer from './Footer'; // Assuming path alias

// Import react-toastify
import { ToastContainer, toast } from 'react-toastify';
// CSS import removed - see explanation below

// --- Main ContactPage Component ---
const ContactPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend API
    console.log('Form data submitted:', formData);

    // Show a success toast
    toast.success('Message sent! We\'ll get back to you soon.', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Clear the form
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="bg-slate-900 text-slate-200 scroll-smooth min-h-screen">
      {/* Add the ToastContainer for notifications */}
      <ToastContainer theme="dark" />
      
      <Navbar /> {/* Corrected component name */}
      
      {/* Page Content */}
      <main className="py-20 px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Header Section */}
          <header className="text-center">
            <h1 className="
              text-6xl md:text-7xl font-extrabold text-slate-100 
              tracking-tighter mb-4
            ">
              Get In <span className="
                bg-clip-text text-transparent 
                bg-gradient-to-r from-sky-400 to-emerald-400
              ">
                Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
              We're here to help. Whether you have a question about our platform
              or want to partner with us, we'd love to hear from you.
            </p>
          </header>

          {/* Contact Grid: Info + Form */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Column 1: Contact Info */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-100 mb-4">Contact Information</h2>
              <p className="text-slate-300 text-lg">
                Fill out the form, or if you prefer, you can reach us directly 
                through one of the channels below.
              </p>
              {/* Glass-morphism card for details */}
              <div className="
                p-8 rounded-2xl
                bg-slate-800/25 backdrop-filter backdrop-blur-lg
                border border-slate-500/30 shadow-lg space-y-6
              ">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  <a href="mailto:info@careerhub.com" className="text-slate-200 hover:text-sky-400 transition-colors break-all">
                    info@careerhub.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-sky-400 flex-shrink-0" />
                  <span className="text-slate-200">+1 (234) 567-890</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-sky-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-200">
                    123 Tech Avenue, Innovation Park, Suite 404,
                    Silicon Valley, CA 94000
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Contact Form */}
            <div className="
              p-8 rounded-2xl
              bg-slate-800/25 backdrop-filter backdrop-blur-lg
              border border-slate-500/30 shadow-lg
            ">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="
                      w-full p-3 rounded-lg text-slate-100
                      border border-slate-500/50 bg-slate-800/30 
                      focus:outline-none focus:ring-2 focus:ring-sky-400
                    " 
                  />
                </div>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full p-3 rounded-lg text-slate-100
                      border border-slate-500/50 bg-slate-800/30 
                      focus:outline-none focus:ring-2 focus:ring-sky-400
                    " 
                  />
                </div>
                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="
                      w-full p-3 rounded-lg text-slate-100
                      border border-slate-500/50 bg-slate-800/30 
                      focus:outline-none focus:ring-2 focus:ring-sky-400
                    "
                  ></textarea>
                </div>
                {/* Submit Button */}
                <button 
                  type="submit"
                  className="
                    flex items-center gap-2
                    w-full justify-center px-6 py-3 rounded-lg 
                    font-semibold bg-emerald-500 text-slate-900
                    hover:bg-emerald-400 transition-colors
                    shadow-lg hover:shadow-emerald-500/40
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-400
                  "
                >
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;