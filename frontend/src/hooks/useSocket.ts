import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore, useChatStore } from '../store/useStore';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const { token, isAuthenticated } = useAuthStore();
    const { setOnlineCount, setRoomId } = useChatStore();
    const [partnerConnected, setPartnerConnected] = useState(false);
    const [queueing, setQueueing] = useState(false);
    const [messages, setMessages] = useState<{ sender: 'me' | 'partner', text: string }[]>([]);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://campus-connect-xzqv.onrender.com';
        socketRef.current = io(socketUrl, {
            auth: { token },
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('online_count', (count) => {
            setOnlineCount(count);
        });

        socket.on('matched', ({ roomId, initiator }) => {
            setRoomId(roomId);
            setPartnerConnected(true);
            setQueueing(false);
            setMessages([]); // Clear previous messages
        });

        socket.on('message', (msg) => {
            setMessages(prev => [...prev, { sender: 'partner', text: msg }]);
        });

        socket.on('partner_left', () => {
            setPartnerConnected(false);
            setRoomId(null);
            // Auto re-queue or let component handle it
        });

        socket.on('disconnect', () => {
            setPartnerConnected(false);
            setRoomId(null);
        });

        return () => {
            socket.disconnect();
        };
    }, [token, isAuthenticated]);

    const joinQueue = (type: 'text' | 'video') => {
        if (!socketRef.current) return;
        setQueueing(true);
        setPartnerConnected(false);
        setRoomId(null);
        socketRef.current.emit('join_queue', { type });
    };

    const skip = () => {
        if (!socketRef.current) return;
        socketRef.current.emit('skip');
        setPartnerConnected(false);
        setRoomId(null);
    };

    const sendMessage = (msg: string) => {
        if (!socketRef.current || !partnerConnected) return; // Prevent blasting messages to void
        socketRef.current.emit('message', msg);
        setMessages(prev => [...prev, { sender: 'me', text: msg }]);
    };

    return {
        socket: socketRef.current,
        joinQueue,
        skip,
        partnerConnected,
        queueing,
        messages,
        sendMessage,
    };
};
