'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, CheckCircle2, XCircle, LogOut } from 'lucide-react';
import { fetchAdminUsers, AdminUser } from '@/utils/admin';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchAdminUsers();
                setUsers(data.users);
            } catch (err) {
                setError('Failed to fetch admin data. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center p-4 md:p-8 overflow-x-hidden font-sans text-white selection:bg-fuchsia-500/30">
            {/* Deep Space Backgrounds & Grid */}
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[#02000A]" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/40 via-[#02000A] to-[#02000A]" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 z-[-2] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>

            {/* Ambient Light Orbs */}
            <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden h-[120vh]">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[0%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[150px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="w-full max-w-6xl relative z-10 space-y-8 mt-4"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 p-6 rounded-[2rem] border border-white/[0.05] backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 flex items-center justify-center border border-fuchsia-500/20 shadow-[0_0_20px_rgba(192,38,211,0.2)]">
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 tracking-tight">System Admin</h1>
                            <p className="text-slate-400 font-medium">Manage registered students and platform access.</p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full border border-white/10"
                    >
                        <LogOut size={18} className="mr-2" />
                        Exit Admin
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] rounded-[2rem] shadow-2xl">
                        <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-cyan-400 mb-2">
                                <Users size={20} />
                                <span className="font-bold uppercase tracking-widest text-xs">Total Registered</span>
                            </div>
                            <span className="text-5xl font-black text-white">{loading ? '-' : users.length}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] rounded-[2rem] shadow-2xl">
                        <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                <CheckCircle2 size={20} />
                                <span className="font-bold uppercase tracking-widest text-xs">Verified Students</span>
                            </div>
                            <span className="text-5xl font-black text-white">{loading ? '-' : users.filter(u => u.verified).length}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] rounded-[2rem] shadow-2xl">
                        <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/[0.05] h-full flex flex-col justify-center">
                            <div className="flex items-center gap-3 text-rose-400 mb-2">
                                <XCircle size={20} />
                                <span className="font-bold uppercase tracking-widest text-xs">Banned Accounts</span>
                            </div>
                            <span className="text-5xl font-black text-white">{loading ? '-' : users.filter(u => u.isBanned).length}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Data Table */}
                <motion.div variants={itemVariants} className="bg-gradient-to-b from-white/[0.08] to-transparent p-[1px] rounded-[2rem] shadow-2xl overflow-hidden">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] overflow-hidden">
                        <div className="p-6 border-b border-white/[0.05]">
                            <h2 className="text-xl font-bold text-white">Student Database</h2>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-slate-400 animate-pulse font-medium tracking-widest uppercase">Fetching Records...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-rose-400 font-medium">{error}</div>
                        ) : users.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 font-medium">No users registered yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.02] border-b border-white/[0.05] text-xs uppercase tracking-widest text-slate-400">
                                            <th className="p-5 font-semibold">Email / College ID</th>
                                            <th className="p-5 font-semibold">Campus</th>
                                            <th className="p-5 font-semibold text-center">Verified</th>
                                            <th className="p-5 font-semibold text-center">Status</th>
                                            <th className="p-5 font-semibold text-right">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.05]">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-5 font-medium text-white">{user.email}</td>
                                                <td className="p-5 text-slate-400">
                                                    <span className="px-3 py-1 bg-white/[0.05] rounded-lg text-xs font-bold border border-white/[0.05]">{user.campus || 'VIT Bhopal'}</span>
                                                </td>
                                                <td className="p-5 text-center">
                                                    {user.verified ? (
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            <CheckCircle2 size={16} />
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                            <XCircle size={16} />
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-5 text-center">
                                                    {user.isBanned ? (
                                                        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-xs font-bold border border-rose-500/20">BANNED</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/20">ACTIVE</span>
                                                    )}
                                                </td>
                                                <td className="p-5 text-right text-slate-400 text-sm">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
