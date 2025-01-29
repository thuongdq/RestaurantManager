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
