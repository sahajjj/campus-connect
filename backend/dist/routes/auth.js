"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = require("../utils/mailer");
const router = express_1.default.Router();
const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/;
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !VIT_EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Only valid @vitbhopal.ac.in emails are allowed' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = new User_1.default({ email, otp, otpExpires, isBanned: false, campus: 'VIT Bhopal' });
        }
        else {
            user.otp = otp;
            user.otpExpires = otpExpires;
        }
        if (user.isBanned) {
            return res.status(403).json({ error: 'Account has been banned' });
        }
        await user.save();
        try {
            // Attempt to actually dispatch the email via SMTP if credentials exist
            await (0, mailer_1.sendOTP)(email, otp);
            console.log(`[SMTP] Successfully dispatched OTP email to ${email}`);
        }
        catch (emailError) {
            console.error('[SMTP Error] Failed to send email. Ensure you have valid standard SMTP_USER and SMTP_PASS credentials in your backend .env file:', emailError.message);
        }
        res.status(200).json({ message: 'OTP sent to your email', otpDev: process.env.NODE_ENV !== 'production' ? otp : undefined });
    }
    catch (error) {
        console.error('Send OTP error', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.status(200).json({ token, user: { email: user.email, campus: user.campus } });
    }
    catch (error) {
        console.error('Verify OTP error', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});
exports.default = router;
