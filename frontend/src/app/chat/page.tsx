'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, SkipForward, Send, Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { useAuthStore, useChatStore } from '@/store/useStore';
import { useSocket } from '@/hooks/useSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ChatPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { chatMode, roomId } = useChatStore();
    const [msgInput, setMsgInput] = useState('');

    const { socket, joinQueue, skip, partnerConnected, queueing, messages, sendMessage } = useSocket();
    const { localVideoRef, remoteVideoRef, toggleVideo, toggleAudio, initMedia } = useWebRTC(socket, roomId);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
            return;
        }
        if (!chatMode) {
            router.push('/dashboard');
            return;
        }

        // Initialize local camera immediately if video chat
        if (chatMode === 'video') {
            initMedia();
        }

        // Auto join on load
        joinQueue(chatMode);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msgInput.trim()) return;

        // If not connected, keep the text in the box and do nothing
        if (!partnerConnected) {
            return;
        }

        sendMessage(msgInput);
        setMsgInput('');
    };

    const handleSkip = () => {
        skip(); // Leaves current partner safely
        joinQueue(chatMode!); // Requeue
    };

    return (
        <main className="relative flex flex-col h-screen max-w-6xl mx-auto p-2 md:p-6 text-white overflow-x-hidden font-sans selection:bg-fuchsia-500/30">
            {/* Deep Space Backgrounds & Grid */}
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[#02000A]" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-[#02000A] to-[#02000A]" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
            <div className="absolute inset-0 z-[-2] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Ambient Light Orbs */}
            <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden h-[120vh]">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[150px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[40%] -right-[10%] w-[30vw] h-[30vw] rounded-full bg-cyan-600/20 blur-[140px]"
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-4 glass-panel bg-black/40 rounded-[1.5rem] mb-4 z-10 border border-white/[0.05]"
            >
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-sm flex items-center gap-3 tracking-tight">
                    Campus Connect
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] shadow-inner">
                        {chatMode}
                    </span>
                </h2>
                <Button
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-xl"
                    onClick={() => router.push('/dashboard')}
                >
                    <LogOut size={18} className="mr-2" />
                    Leave
                </Button>
            </motion.header>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className="flex-1 flex flex-col gap-4 overflow-hidden relative z-10"
            >

                {/* Video Area */}
                {chatMode === 'video' && (
                    <div className="flex flex-col md:flex-row flex-[1.5] gap-4 relative">
                        {/* Remote Video Container */}
                        <div className="flex-1 relative bg-black/60 border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center backdrop-blur-xl group">
                            {partnerConnected ? (
                                <motion.video
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-slate-400 flex flex-col items-center gap-6">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                        <div className="w-20 h-20 rounded-full border-[4px] border-t-cyan-400 border-r-transparent border-b-fuchsia-600 border-l-transparent shadow-[0_0_30px_rgba(6,182,212,0.2)]" />
                                    </motion.div>
                                    <span className="font-bold tracking-widest uppercase text-base animate-pulse text-cyan-200">
                                        {queueing ? "Finding a VITian..." : "Waiting..."}
                                    </span>
                                </div>
                            )}

                            {/* Media Controls for Remote Area */}
                            {partnerConnected && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 p-2.5 rounded-[1.5rem] backdrop-blur-xl border border-white/[0.1] shadow-2xl"
                                >
                                    <Button size="icon" variant="secondary" onClick={toggleAudio} className="rounded-xl w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/[0.1] shadow-lg transition-transform hover:scale-105 active:scale-95 text-white">
                                        <Mic size={20} />
                                    </Button>
                                    <Button size="icon" variant="secondary" onClick={toggleVideo} className="rounded-xl w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/[0.1] shadow-lg transition-transform hover:scale-105 active:scale-95 text-white">
                                        <Camera size={20} />
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Local Video Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 relative bg-black/60 border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center backdrop-blur-xl"
                        >
                            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                            <div className="absolute top-5 left-5 glass-panel px-4 py-1.5 rounded-full border border-white/[0.15] bg-black/30">
                                <span className="text-xs font-bold tracking-widest uppercase text-white drop-shadow-md">You</span>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Chat Area */}
                <div className={`flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl flex-1 max-h-[45vh]`}>

                    <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 space-y-2">
                        {!partnerConnected && (
                            <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-5 text-center px-4">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                                    <div className="w-12 h-12 rounded-full border-[3px] border-t-fuchsia-400 border-r-transparent border-b-cyan-600 border-l-transparent" />
                                </motion.div>
                                <p className="font-medium animate-pulse tracking-widest uppercase text-xs text-fuchsia-200/70">
                                    {queueing ? "Looking for a stray VITian..." : "Disconnected. Press Next."}
                                </p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={i}
                                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`px-5 py-3 rounded-[1.2rem] max-w-[85%] break-words text-[15px] leading-relaxed shadow-lg border ${m.sender === 'me'
                                    ? 'bg-gradient-to-br from-fuchsia-600 to-rose-600 border-fuchsia-400/50 rounded-br-sm text-white'
                                    : 'bg-white/[0.05] border-white/[0.1] rounded-bl-sm text-slate-200 backdrop-blur-md'
                                    }`}>
                                    {m.text}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Controls / Input */}
                    <div className="p-4 bg-black/40 border-t border-white/[0.08] flex gap-3 backdrop-blur-2xl">
                        <Button
                            onClick={handleSkip}
                            className="h-12 bg-red-500/80 hover:bg-red-500 text-white rounded-xl px-5 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all font-semibold tracking-wide"
                        >
                            <SkipForward size={18} className="md:mr-2" />
                            <span className="hidden md:inline">Next</span>
                        </Button>

                        <form onSubmit={handleSend} className="flex-1 flex gap-2">
                            <Input
                                value={msgInput}
                                onChange={(e) => setMsgInput(e.target.value)}
                                placeholder={partnerConnected ? "Type a message..." : "Type a message to send when connected..."}
                                className={`h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-400/50 focus:bg-white/[0.06] transition-all font-medium shadow-inner ${!partnerConnected ? 'opacity-80' : ''}`}
                            />
                            <Button type="submit" disabled={!msgInput.trim()} className={`relative h-12 w-14 p-0 bg-black text-white border border-white/10 rounded-xl shrink-0 shadow-[0_0_15px_rgba(192,38,211,0.2)] hover:shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 group ${!partnerConnected ? 'brightness-75' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 via-fuchsia-600/50 to-rose-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
                                <Send size={20} className="relative z-10 translate-x-[-1px] translate-y-[1px]" />
                            </Button>
                        </form>
                    </div>

                </div>

            </motion.div>
        </main>
    );
}
