import authApiRequest from '@/apiRequests/auth';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.login,
        onSuccess: (data) => {
            console.log('Đăng nhập thành công:', data);
        },
        onError: (error) => {
            console.error('Lỗi đăng nhập:', error);
        },
    });
};

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.logout,
        onSuccess: (data) => {
            console.log('Đăng xuất thành công:', data);
        },
        onError: (error) => {
            console.error('Lỗi đăng xuất:', error);
        },
    });
};
