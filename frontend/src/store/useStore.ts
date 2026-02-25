import { create } from 'zustand';

interface UserState {
    email: string | null;
    campus: string | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (email: string, campus: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<UserState>((set) => ({
    email: null,
    campus: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,

    setAuth: (email, campus, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
        set({ email, campus, token, isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        set({ email: null, campus: null, token: null, isAuthenticated: false });
    },
}));

interface ChatState {
    onlineCount: number;
    setOnlineCount: (count: number) => void;
    roomId: string | null;
    setRoomId: (id: string | null) => void;
    chatMode: 'text' | 'video' | null;
    setChatMode: (mode: 'text' | 'video' | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    onlineCount: 0,
    setOnlineCount: (count) => set({ onlineCount: count }),
    roomId: null,
    setRoomId: (id) => set({ roomId: id }),
    chatMode: null,
    setChatMode: (mode) => set({ chatMode: mode }),
}));
