import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://campus-connect-xzqv.onrender.com/api';

export interface AdminUser {
    _id: string;
    email: string;
    verified: boolean;
    isBanned: boolean;
    campus: string;
    createdAt: string;
}

export interface AdminStats {
    count: number;
    users: AdminUser[];
}

export const fetchAdminUsers = async (): Promise<AdminStats> => {
    try {
        const response = await axios.get(`${API_URL}/auth/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw error;
    }
};
