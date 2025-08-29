

const dev = "http://localhost:3000/";

export const BASE_URL = dev;

const AppRoutes = {
    signup: `${BASE_URL}api/auth/signUp`,
    login: `${BASE_URL}api/auth/login`,
}

export {
    AppRoutes
}