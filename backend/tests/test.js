// sendMail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function sendMail() {
  try {
    // Check if credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Missing email credentials! Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
      process.exit(1);
    }

    // 1️⃣ Create a transporter using your email provider (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       // your email address from .env
        pass: process.env.EMAIL_PASSWORD,     // your app password from .env
      },
    });

    // 2️⃣ Define the mail options
    const mailOptions = {
      from: `"College Placement System" <${process.env.EMAIL_USER}>`,
      to: "test-recipient@example.com",  // Change this to your test email
      subject: "Hello from Nodemailer 🚀",
      text: "This is a test email sent using Nodemailer and App Password.",
      html: "<h2>Hello from Nodemailer 🚀</h2><p>This email was sent using an App Password.</p>",
    };

    // 3️⃣ Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);

  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

// Run the function
sendMail();
