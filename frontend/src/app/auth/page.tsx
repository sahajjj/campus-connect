'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/utils/api';
import { useAuthStore } from '@/store/useStore';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setAuth = useAuthStore(state => state.setAuth);
    const router = useRouter();

    const handleSendOtp = async () => {
        setError('');
        setLoading(true);
        try {
            if (!/^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/.test(email)) {
                throw new Error('Please use a valid @vitbhopal.ac.in email');
            }
            const res = await api.post('/auth/send-otp', { email });
            setStep('otp');
            // For testing, mock OTP is returned if not in production
            if (res.data.otpDev) {
                // Since user isn't receiving the emails, we will display it explicitly so they can continue testing UI
                alert(`Development Mode OTP: ${res.data.otpDev}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            setAuth(res.data.user.email, res.data.user.campus, res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden font-sans">
            {/* Deep Space Backgrounds & Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-[#02000A]" />
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-[#02000A] to-[#02000A]" />
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
            <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Ambient Light Orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-[120vh]">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[150px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[140px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="glass-panel bg-black/50 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/[0.05]">
                    {/* Sophisticated top glow line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent blur-[1px]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-2 tracking-tight"
                        >
                            Campus Connect
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 font-medium tracking-wide text-sm"
                        >
                            Exclusive network for <span className="text-fuchsia-400 font-bold">VIT Bhopal</span>
                        </motion.p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 rounded-xl bg-red-950/40 p-4 text-sm text-red-300 border border-red-900/50 shadow-inner backdrop-blur-md"
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </span>
                        </motion.div>
                    )}

                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="space-y-6"
                    >
                        {step === 'email' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 ml-1">College Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="sahaj.23bcy... @vitbhopal.ac.in"
                                            className="h-14 pl-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-500 pr-5 rounded-2xl focus:border-cyan-400/50 focus:bg-white/[0.06] transition-all duration-300 shadow-inner group-hover:bg-white/[0.05]"
                                        />
                                    </div>
                                </div>
                                <div className="relative group mt-8">
                                    <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-rose-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                                    <Button
                                        className="relative w-full h-14 bg-black text-white font-bold text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden border border-white/10 hover:border-transparent active:scale-[0.98] shadow-2xl"
                                        onClick={handleSendOtp}
                                        disabled={loading}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-fuchsia-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                                        <span className="relative z-10">
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Authenticating...
                                                </div>
                                            ) : 'Verify Student ID'}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2 text-center">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Enter 6-Digit OTP</label>
                                    <Input
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="••••••"
                                        className="h-16 bg-white/[0.03] border-white/[0.08] text-white text-center tracking-[1em] text-2xl font-mono rounded-2xl focus:border-cyan-400/50 focus:bg-white/[0.06] transition-all duration-300 mx-auto shadow-inner"
                                        maxLength={6}
                                        autoFocus
                                    />
                                    <p className="text-xs text-slate-500 mt-3 font-medium">Code sent to <span className="text-cyan-400">{email}</span></p>
                                </div>
                                <div className="relative group mt-8">
                                    <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-rose-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                                    <Button
                                        className="relative w-full h-14 bg-black text-white font-bold text-lg rounded-full transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden border border-white/10 hover:border-transparent active:scale-[0.98] shadow-2xl"
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otp.length < 6}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-fuchsia-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                                        <span className="relative z-10">{loading ? 'Verifying...' : 'Access Platform'}</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </main>
    );
}
