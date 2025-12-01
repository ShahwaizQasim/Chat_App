import { PrivateVariables } from "../config/config";


const AppRoutes = {
    signup: `${PrivateVariables.BACKEND_URL}/api/auth/signUp`,
    login: `${PrivateVariables.BACKEND_URL}/api/auth/login`,
    UsersGet: `${PrivateVariables.BACKEND_URL}/api/get/all_users`,
    GetMessages: `${PrivateVariables.BACKEND_URL}/api/get/chat_message/`
}

export {
    AppRoutes
}