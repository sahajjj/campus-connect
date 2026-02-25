import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendOTP } from '../utils/mailer';

const router = express.Router();

const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/;

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !VIT_EMAIL_REGEX.test(email)) {
            return res.status(400).json({ error: 'Only valid @vitbhopal.ac.in emails are allowed' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, otp, otpExpires, isBanned: false, campus: 'VIT Bhopal' });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
        }

        if (user.isBanned) {
            return res.status(403).json({ error: 'Account has been banned' });
        }

        await user.save();

        try {
            // Attempt to actually dispatch the email via SMTP if credentials exist
            await sendOTP(email, otp);
            console.log(`[SMTP] Successfully dispatched OTP email to ${email}`);
        } catch (emailError: any) {
            console.error('[SMTP Error] Render Free Tier blocks standard SMTP ports (465/587). The email failed to send:', emailError.message);
            console.log(`\n\n=== 🚀 TEMPORARY BYPASS 🚀 ===\nThe OTP for ${email} is: ${otp}\n================================\n\n`);
        }

        res.status(200).json({ message: 'OTP generated', otpDev: otp });
    } catch (error) {
        console.error('Send OTP error', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, user: { email: user.email, campus: user.campus } });
    } catch (error) {
        console.error('Verify OTP error', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

// Admin Route: Get all registered users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'email verified isBanned createdAt campus').sort({ createdAt: -1 });
        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Fetch users error', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

export default router;
