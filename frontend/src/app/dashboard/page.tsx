'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, MessageSquare, Users } from 'lucide-react';
import { useAuthStore, useChatStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/hooks/useSocket';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const { onlineCount, setChatMode } = useChatStore();
  const { socket } = useSocket();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleStart = (mode: 'text' | 'video') => {
    setChatMode(mode);
    router.push('/chat');
  };

  if (!isAuthenticated) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden font-sans selection:bg-fuchsia-500/30">

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
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl text-center space-y-16"
      >
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 backdrop-blur-3xl shadow-xl hover:bg-white/[0.06] transition-all duration-300">
            <span className="relative flex h-3.5 w-3.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
            </span>
            <span className="font-semibold text-sm tracking-widest uppercase"><strong className="text-white text-base mr-1">{onlineCount}</strong> Online</span>
          </div>

          <h1 className="text-6xl md:text-[6rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tighter drop-shadow-2xl">
            Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Now</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide max-w-2xl mx-auto drop-shadow-md">
            The exclusive anonymous network for verified <span className="text-fuchsia-400 font-bold">VIT Bhopal</span> students.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mt-16 px-4 max-w-3xl mx-auto">
          {/* Text Chat Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-[2.5rem] p-[1.5px] bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl overflow-hidden cursor-pointer"
            onClick={() => handleStart('text')}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-pink-600/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="w-full h-56 md:h-64 text-2xl bg-black/60 group-hover:bg-black/80 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center justify-center gap-6 text-white transition-all duration-500 relative z-10 border border-white/[0.05] group-hover:border-fuchsia-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-fuchsia-500/0 group-hover:from-fuchsia-500/10 group-hover:to-transparent transition-all duration-500" />

              <div className="relative p-5 rounded-3xl bg-white/[0.04] text-slate-400 border border-white/[0.08] group-hover:scale-110 group-hover:bg-fuchsia-500/15 group-hover:text-fuchsia-400 group-hover:border-fuchsia-500/40 transition-all duration-500 z-10 shadow-inner group-hover:shadow-[0_0_20px_rgba(192,38,211,0.2)]">
                <MessageSquare size={48} strokeWidth={1.5} />
              </div>
              <span className="font-bold tracking-widest uppercase text-xl relative z-10 text-slate-300 group-hover:text-fuchsia-300 transition-colors duration-300">Text Chat</span>
            </div>
          </motion.div>

          {/* Video Chat Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-[2.5rem] p-[1.5px] bg-gradient-to-b from-white/[0.08] to-transparent shadow-2xl overflow-hidden cursor-pointer"
            onClick={() => handleStart('video')}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="w-full h-56 md:h-64 text-2xl bg-black/60 group-hover:bg-black/80 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center justify-center gap-6 text-white transition-all duration-500 relative z-10 border border-white/[0.05] group-hover:border-cyan-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/10 group-hover:to-transparent transition-all duration-500" />

              <div className="relative p-5 rounded-3xl bg-white/[0.04] text-slate-400 border border-white/[0.08] group-hover:scale-110 group-hover:bg-cyan-500/15 group-hover:text-cyan-400 group-hover:border-cyan-400/40 transition-all duration-500 z-10 shadow-inner group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <Video size={48} strokeWidth={1.5} />
              </div>
              <span className="font-bold tracking-widest uppercase text-xl relative z-10 text-slate-300 group-hover:text-cyan-300 transition-colors duration-300">Video Chat</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-16 pb-8">
          <button
            onClick={logout}
            className="text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors duration-300 border border-transparent hover:border-red-500/30 px-6 py-2.5 rounded-full hover:bg-red-500/5 shadow-sm"
          >
            Switch Account
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
