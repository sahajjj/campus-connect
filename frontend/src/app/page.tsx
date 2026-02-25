'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MessageSquare, Video, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';

export default function LandingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            router.push('/dashboard');
        } else {
            router.push('/auth');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <main className="relative flex flex-col items-center min-h-screen text-slate-100 overflow-x-hidden font-sans selection:bg-fuchsia-500/30">
            {/* Deep Space Backgrounds */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[#02000A]" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-[#02000A] to-[#02000A]" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
            <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-[120vh]">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[150px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/20 blur-[140px]"
                />
            </div>

            {/* Navigation / Header */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-8 relative z-20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-lg blur opacity-40"></div>
                        <div className="relative w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-white">
                        Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Connect</span>
                    </span>
                </div>

                <Button
                    variant="ghost"
                    onClick={handleGetStarted}
                    className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-full px-6 transition-all border border-transparent hover:border-white/10"
                >
                    {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Button>
            </nav>

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-4 text-center mt-12 md:mt-24 pb-32"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-3xl mb-12 border border-fuchsia-500/30 shadow-[0_0_30px_rgba(192,38,211,0.15)] ring-1 ring-white/5">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-cyan-300">Live for VIT Bhopal</span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-[7rem] leading-[1.05] font-black tracking-tighter mb-8 max-w-5xl">
                    <span className="text-white">Meet your campus.</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-rose-400 drop-shadow-[0_0_40px_rgba(192,38,211,0.3)]">
                        Anonymously.
                    </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400/90 font-medium tracking-wide max-w-2xl mx-auto mb-14 leading-relaxed">
                    The exclusive, secure network for verified students. Jump into text or high-fidelity video chat instantly.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto relative group z-20">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-rose-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
                    <Button
                        onClick={handleGetStarted}
                        className="relative w-full sm:w-auto h-16 px-12 text-xl font-bold bg-black text-white rounded-full transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden border border-white/10 hover:border-transparent hover:scale-105 active:scale-95 shadow-2xl"
                    >
                        <span className="relative z-10">{isAuthenticated ? 'Enter the Dashboard' : 'Verify Student ID'}</span>
                        <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-fuchsia-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                    </Button>
                </motion.div>

                {/* Bento Box Layout */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left max-w-5xl">
                    {/* Large Card - Spans 2 cols */}
                    <div className="md:col-span-2 relative group rounded-[2.5rem] bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] shadow-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                        <div className="h-full bg-black/60 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col justify-end border border-white/[0.05] group-hover:border-fuchsia-500/30 transition-colors relative z-10 overflow-hidden">
                            <div className="absolute top-10 right-10 w-48 h-48 bg-fuchsia-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-fuchsia-500/30 transition-colors" />
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 flex items-center justify-center mb-8 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(192,38,211,0.2)]">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Real-time Text Matchmaking</h3>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-md">Instantly drop into anonymous conversations with random students on campus. Share, consult, or just vibe with someone new.</p>
                        </div>
                    </div>

                    {/* Square Card 1 */}
                    <div className="relative group rounded-[2.5rem] bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] shadow-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                        <div className="h-full bg-black/60 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col justify-end border border-white/[0.05] group-hover:border-cyan-500/30 transition-colors relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-400 flex items-center justify-center mb-8 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                <Video size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">P2P Video</h3>
                            <p className="text-slate-400 text-base leading-relaxed font-medium">Crisp, low-latency video feeds built on secure WebRTC logic.</p>
                        </div>
                    </div>

                    {/* Square Card 2 */}
                    <div className="md:col-span-3 relative group rounded-[2.5rem] bg-gradient-to-r from-white/[0.08] to-transparent p-[1px] shadow-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                        <div className="h-full bg-black/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/[0.05] group-hover:border-rose-500/30 transition-colors relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 text-rose-400 flex items-center justify-center mb-6 md:mb-8 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Exclusive & Verified</h3>
                                <p className="text-slate-400 text-base leading-relaxed font-medium max-w-lg">Zero bots. Zero outsiders. We verify every single user via the official college student email to guarantee a 100% genuine campus ecosystem.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg flex shrink-0">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs font-bold text-white/50">
                                            VIT
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer */}
            <footer className="w-full py-6 mt-auto text-center relative z-20 border-t border-white/[0.02] bg-black/20 backdrop-blur-sm">
                <p className="text-slate-500 text-sm font-medium tracking-wide">
                    Made with <span className="text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">❤️</span> by{' '}
                    <a href="https://github.com/sahajsharma" target="_blank" rel="noopener noreferrer" className="text-slate-300 font-bold hover:text-white transition-colors duration-300 relative group">
                        Sahaj Sharma
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </p>
            </footer>
        </main>
    );
}
