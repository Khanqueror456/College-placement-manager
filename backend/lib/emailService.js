/**
 * Email Service
 * Handles all email communications in the application
 */

import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { logInfo, logError } from '../middlewares/logger.js';

// Create reusable transporter object using Nodemailer with Gmail (Simple App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Debug: Log email configuration (remove in production)
console.log('📧 Email Config:', {
  service: 'Gmail',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET'
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

/**
 * Send email utility function
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmail = async (options) => {
  console.log('🚀 Attempting to send email:', {
    to: options.to,
    subject: options.subject,
    hasText: !!options.text,
    hasHtml: !!options.html
  });

  try {
    const mailOptions = {
      from: `"College Placement Portal" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    console.log('📧 Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    console.log('🔄 Sending mail via transporter...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    logInfo('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId
    });

    return true;
  } catch (error) {
    console.error('❌ Email sending failed with detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    logError('Email sending failed', {
      to: options.to,
      subject: options.subject,
      error: error.message,
      code: error.code,
      response: error.response
    });
    return false;
  }
};

/**
 * Send student approval email
 * @param {Object} student - Student details
 * @param {Object} approver - HOD details
 */
export const sendStudentApprovalEmail = async (student, approver) => {
  const subject = '🎉 Account Approved - College Placement Portal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎉 Account Approved!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${student.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Congratulations! Your registration for the College Placement Portal has been approved by your Head of Department.
        </p>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 10px 0;">✅ What's Next?</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>You can now log in to your account</li>
            <li>Complete your profile with academic details</li>
            <li>Upload your resume</li>
            <li>Start applying for placement drives</li>
          </ul>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Approved by:</strong> ${approver.name}<br>
            <strong>Department:</strong> ${student.department}<br>
            <strong>Roll Number:</strong> ${student.rollNumber}<br>
            <strong>Approval Date:</strong> ${new Date().toLocaleDateString('en-IN')}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.cors.origin}/login" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Login to Your Account
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          If you have any questions, please contact the Placement Cell.<br>
          <strong>College Placement Portal</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${student.name},
    
    Congratulations! Your registration for the College Placement Portal has been approved by your Head of Department.
    
    You can now:
    - Log in to your account
    - Complete your profile
    - Upload your resume
    - Apply for placement drives
    
    Approved by: ${approver.name}
    Department: ${student.department}
    Roll Number: ${student.rollNumber}
    Approval Date: ${new Date().toLocaleDateString('en-IN')}
    
    Login at: ${config.cors.origin}/login
    
    Best regards,
    College Placement Portal
  `;

  return await sendEmail({
    to: student.email,
    subject,
    html,
    text
  });
};

/**
 * Send student rejection email
 * @param {Object} student - Student details
 * @param {Object} rejector - HOD details
 * @param {string} reason - Rejection reason
 */
export const sendStudentRejectionEmail = async (student, rejector, reason) => {
  const subject = '❌ Registration Status Update - College Placement Portal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Registration Update</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${student.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We regret to inform you that your registration for the College Placement Portal has not been approved at this time.
        </p>
        
        <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
          <h3 style="color: #c62828; margin: 0 0 10px 0;">Reason for Rejection:</h3>
          <p style="color: #333; margin: 0; font-style: italic;">"${reason}"</p>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">📋 What You Can Do:</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Review the rejection reason carefully</li>
            <li>Contact your HOD for clarification</li>
            <li>Address the mentioned issues</li>
            <li>Reapply after resolving the concerns</li>
          </ul>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            <strong>Reviewed by:</strong> ${rejector.name}<br>
            <strong>Department:</strong> ${student.department}<br>
            <strong>Roll Number:</strong> ${student.rollNumber}<br>
            <strong>Review Date:</strong> ${new Date().toLocaleDateString('en-IN')}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${rejector.email}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Contact HOD
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          For any queries, please contact your Head of Department or the Placement Cell.<br>
          <strong>College Placement Portal</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${student.name},
    
    We regret to inform you that your registration for the College Placement Portal has not been approved at this time.
    
    Reason for Rejection: ${reason}
    
    What you can do:
    - Review the rejection reason carefully
    - Contact your HOD for clarification
    - Address the mentioned issues
    - Reapply after resolving the concerns
    
    Reviewed by: ${rejector.name}
    Department: ${student.department}
    Roll Number: ${student.rollNumber}
    Review Date: ${new Date().toLocaleDateString('en-IN')}
    
    Contact HOD: ${rejector.email}
    
    Best regards,
    College Placement Portal
  `;

  return await sendEmail({
    to: student.email,
    subject,
    html,
    text
  });
};

/**
 * Send application status update email
 * @param {Object} student - Student details
 * @param {Object} application - Application details
 * @param {string} newStatus - New application status
 * @param {string} comments - TPO comments
 */
export const sendApplicationStatusEmail = async (student, application, newStatus, comments = '') => {
  let subject, statusColor, statusMessage, actionMessage;

  switch (newStatus.toLowerCase()) {
    case 'accepted':
    case 'selected':
      statusColor = '#4CAF50';
      subject = '🎉 Congratulations! You have been selected';
      statusMessage = 'Congratulations! You have been selected for the position.';
      actionMessage = 'Our HR team will contact you soon with further details about the joining process.';
      break;
    
    case 'rejected':
      statusColor = '#f44336';
      subject = '📄 Application Update - Not Selected';
      statusMessage = 'We regret to inform you that you have not been selected for this position.';
      actionMessage = 'Don\'t be discouraged! Keep applying to other opportunities available on the portal.';
      break;
    
    case 'shortlisted':
      statusColor = '#FF9800';
      subject = '✨ Good News! You have been shortlisted';
      statusMessage = 'Great news! You have been shortlisted for the next round.';
      actionMessage = 'Please prepare for the upcoming interview/test. You will receive further instructions soon.';
      break;
    
    case 'under_review':
      statusColor = '#2196F3';
      subject = '👀 Your application is under review';
      statusMessage = 'Your application is currently under review by the company.';
      actionMessage = 'Please wait for further updates. We will notify you once the review is complete.';
      break;
    
    default:
      statusColor = '#9C27B0';
      subject = '📋 Application Status Update';
      statusMessage = `Your application status has been updated to: ${newStatus}`;
      actionMessage = 'Please check your dashboard for more details.';
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: ${statusColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${subject}</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${student.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          ${statusMessage}
        </p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">📋 Application Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${application.companyName}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${application.jobRole}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Application ID:</strong> ${application.id}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> 
            <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${newStatus}</span>
          </p>
          <p style="margin: 5px 0; color: #666;"><strong>Updated:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        
        ${comments ? `
        <div style="background-color: #e8f4f8; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">💬 Comments from TPO:</h3>
          <p style="color: #333; margin: 0; font-style: italic;">"${comments}"</p>
        </div>
        ` : ''}
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 10px 0;">📝 Next Steps:</h3>
          <p style="color: #333; margin: 0;">${actionMessage}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.cors.origin}/student/applications" 
             style="background-color: ${statusColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Application Details
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Keep checking your dashboard for more opportunities!<br>
          <strong>College Placement Portal</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${student.name},
    
    ${statusMessage}
    
    Application Details:
    - Company: ${application.companyName}
    - Position: ${application.jobRole}
    - Application ID: ${application.id}
    - Status: ${newStatus.toUpperCase()}
    - Updated: ${new Date().toLocaleDateString('en-IN')}
    
    ${comments ? `Comments from TPO: "${comments}"` : ''}
    
    Next Steps: ${actionMessage}
    
    View your applications: ${config.cors.origin}/student/applications
    
    Best regards,
    College Placement Portal
  `;

  return await sendEmail({
    to: student.email,
    subject,
    html,
    text
  });
};

/**
 * Send new placement drive notification
 * @param {Object} student - Student details
 * @param {Object} drive - Drive details
 */
export const sendNewDriveNotification = async (student, drive) => {
  const subject = `🚀 New Placement Opportunity: ${drive.companyName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🚀 New Placement Drive!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${student.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          A new placement opportunity has been posted that matches your profile!
        </p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0;">💼 Job Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${drive.companyName}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${drive.jobRole}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Package:</strong> ${drive.package}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Location:</strong> ${drive.location}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Type:</strong> ${drive.jobType}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Application Deadline:</strong> ${new Date(drive.applicationDeadline).toLocaleDateString('en-IN')}</p>
        </div>
        
        <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
          <h3 style="color: #ef6c00; margin: 0 0 10px 0;">⚡ Don't Miss Out!</h3>
          <p style="color: #333; margin: 0;">Apply now to secure your spot. Applications are processed on a first-come, first-served basis.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.cors.origin}/student/drives" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Apply Now
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Login to your dashboard to view full details and apply.<br>
          <strong>College Placement Portal</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${student.name},
    
    A new placement opportunity has been posted that matches your profile!
    
    Job Details:
    - Company: ${drive.companyName}
    - Position: ${drive.jobRole}
    - Package: ${drive.package}
    - Location: ${drive.location}
    - Type: ${drive.jobType}
    - Application Deadline: ${new Date(drive.applicationDeadline).toLocaleDateString('en-IN')}
    
    Don't miss out! Apply now to secure your spot.
    
    Apply at: ${config.cors.origin}/student/drives
    
    Best regards,
    College Placement Portal
  `;

  return await sendEmail({
    to: student.email,
    subject,
    html,
    text
  });
};

/**
 * Send offer letter email with attachment
 * @param {Object} student - Student details
 * @param {Object} application - Application details
 * @param {string} offerLetterPath - Path to offer letter file
 */
export const sendOfferLetterEmail = async (student, application, offerLetterPath) => {
  const subject = '🎉 Congratulations! Your Offer Letter is Ready';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎉 Offer Letter Available!</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${student.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Congratulations on your selection! Your official offer letter from <strong>${application.companyName}</strong> 
          for the position of <strong>${application.jobRole}</strong> is now ready.
        </p>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #2e7d32; margin: 0 0 15px 0;">📋 Offer Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${application.companyName}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Position:</strong> ${application.jobRole}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Package:</strong> ${application.package || 'As discussed'}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h3 style="color: #856404; margin: 0 0 10px 0;">📎 Offer Letter Attached</h3>
          <p style="color: #856404; margin: 0;">
            Please download and review your offer letter attached to this email. Keep it safe for your records.
          </p>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">📝 Next Steps:</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Review the offer letter carefully</li>
            <li>Sign and return as per instructions</li>
            <li>Complete any joining formalities</li>
            <li>Wait for further communication from the company</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.cors.origin}/student/applications" 
             style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Congratulations once again on your achievement!<br>
          <strong>College Placement Portal</strong>
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${student.name},
    
    Congratulations on your selection! Your official offer letter from ${application.companyName} 
    for the position of ${application.jobRole} is now ready and attached to this email.
    
    Offer Details:
    - Company: ${application.companyName}
    - Position: ${application.jobRole}
    - Package: ${application.package || 'As discussed'}
    - Date: ${new Date().toLocaleDateString('en-IN')}
    
    Next Steps:
    - Review the offer letter carefully
    - Sign and return as per instructions
    - Complete any joining formalities
    - Wait for further communication from the company
    
    You can also view your offer letter in your dashboard at: ${config.cors.origin}/student/applications
    
    Congratulations once again on your achievement!
    
    Best regards,
    College Placement Portal
  `;

  try {
    const mailOptions = {
      from: `"College Placement Portal" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject,
      html,
      text,
      attachments: [
        {
          filename: `Offer_Letter_${student.name.replace(/\s+/g, '_')}.pdf`,
          path: offerLetterPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    
    logInfo('Offer letter email sent successfully', {
      to: student.email,
      subject: subject,
      messageId: info.messageId,
      hasAttachment: true
    });

    return true;
  } catch (error) {
    logError('Offer letter email sending failed', {
      to: student.email,
      subject: subject,
      error: error.message
    });
    return false;
  }
};

/**
 * Send bulk notification email
 * @param {Array} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} message - Email message
 * @param {Object} driveDetails - Optional drive details for context
 */
export const sendBulkNotification = async (recipients, subject, message, driveDetails = null) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">📢 ${subject}</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear Student,
        </p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="color: #333; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        ${driveDetails ? `
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">🏢 Drive Details:</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${driveDetails.companyName}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Role:</strong> ${driveDetails.jobRole}</p>
          ${driveDetails.package ? `<p style="margin: 5px 0; color: #666;"><strong>Package:</strong> ${driveDetails.package}</p>` : ''}
          ${driveDetails.deadline ? `<p style="margin: 5px 0; color: #666;"><strong>Deadline:</strong> ${new Date(driveDetails.deadline).toLocaleDateString('en-IN')}</p>` : ''}
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.cors.origin}/student/drives" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Placement Drives
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          <strong>College Placement Portal</strong><br>
          Training & Placement Cell
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear Student,
    
    ${message}
    
    ${driveDetails ? `
    Drive Details:
    - Company: ${driveDetails.companyName}
    - Role: ${driveDetails.jobRole}
    ${driveDetails.package ? `- Package: ${driveDetails.package}` : ''}
    ${driveDetails.deadline ? `- Deadline: ${new Date(driveDetails.deadline).toLocaleDateString('en-IN')}` : ''}
    ` : ''}
    
    Visit the portal for more details: ${config.cors.origin}/student/drives
    
    Best regards,
    College Placement Portal
    Training & Placement Cell
  `;

  const results = [];
  
  for (const email of recipients) {
    try {
      await sendEmail({
        to: email,
        subject,
        html,
        text
      });
      results.push({ email, success: true });
    } catch (error) {
      results.push({ email, success: false, error: error.message });
    }
  }

  return results;
};

/**
 * Send password reset email
 * @param {Object} user - User details
 * @param {string} resetToken - Password reset token
 * @param {string} resetUrl - Password reset URL
 */
export const sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  const subject = '🔐 Password Reset Request - College Placement Portal';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          Dear <strong>${user.name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We received a request to reset your password for the College Placement Portal. 
          If you didn't make this request, you can safely ignore this email.
        </p>
        
        <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
          <h3 style="color: #ef6c00; margin: 0 0 10px 0;">⚠️ Important Security Information</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>This link is valid for <strong>15 minutes</strong> only</li>
            <li>For security reasons, the link can only be used once</li>
            <li>Never share this link with anyone</li>
            <li>If you didn't request this, please contact support immediately</li>
          </ul>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
            <strong>Account Details:</strong>
          </p>
          <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${user.email}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Role:</strong> ${user.role}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Department:</strong> ${user.department || 'N/A'}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Request Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
            Reset Your Password
          </a>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">🔗 Alternative Link</h3>
          <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #1976d2; margin: 0; word-break: break-all; font-size: 13px;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="background-color: #ffebee; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="color: #c62828; margin: 0 0 10px 0;">🛡️ Didn't Request This?</h3>
          <p style="color: #333; margin: 0; font-size: 14px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            For security concerns, please contact the Placement Cell immediately.
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          This is an automated email. Please do not reply to this message.<br>
          <strong>College Placement Portal</strong><br>
          Training & Placement Cell
        </p>
      </div>
    </div>
  `;

  const text = `
    Dear ${user.name},
    
    We received a request to reset your password for the College Placement Portal.
    
    IMPORTANT SECURITY INFORMATION:
    - This link is valid for 15 minutes only
    - For security reasons, the link can only be used once
    - Never share this link with anyone
    - If you didn't request this, please contact support immediately
    
    Account Details:
    - Email: ${user.email}
    - Role: ${user.role}
    - Department: ${user.department || 'N/A'}
    - Request Time: ${new Date().toLocaleString('en-IN')}
    
    To reset your password, click the link below or copy it into your browser:
    ${resetUrl}
    
    DIDN'T REQUEST THIS?
    If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
    For security concerns, please contact the Placement Cell immediately.
    
    Best regards,
    College Placement Portal
    Training & Placement Cell
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
    text
  });
};

/**
 * Test email configuration
 */
export const testEmailConnection = async () => {
  console.log('🔍 Testing email connection...');
  console.log('📋 Current email configuration:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET',
    service: 'Gmail'
  });

  try {
    console.log('⏳ Verifying transporter...');
    const result = await transporter.verify();
    console.log('✅ Email service connection verified successfully:', result);
    logInfo('Email service connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed with detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    
    logError('Email service connection failed', { 
      error: error.message,
      code: error.code,
      response: error.response 
    });
    return false;
  }
};

export default {
  sendEmail,
  sendStudentApprovalEmail,
  sendStudentRejectionEmail,
  sendApplicationStatusEmail,
  sendNewDriveNotification,
  sendOfferLetterEmail,
  sendBulkNotification,
  sendPasswordResetEmail,
  testEmailConnection
};