import http from '@/lib/http';
import { AccountResType } from '@/schemaValidations/account.schema';

const apiAccountRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
};
export default apiAccountRequest;
