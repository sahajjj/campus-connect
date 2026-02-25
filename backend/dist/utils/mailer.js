"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: '"VIT Bhopal Connect" <no-reply@vitconnect.in>',
        to: email,
        subject: 'Your OTP for VIT Bhopal Anonymous Chat',
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #1e3a8a;">
        <h2>VIT Bhopal Exclusive Chat</h2>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="color: #fbbf24; background: #1e3a8a; display: inline-block; padding: 10px 20px; border-radius: 5px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>Do not share this code with anyone.</p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOTP = sendOTP;
