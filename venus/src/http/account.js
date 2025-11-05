import axios from "axios";
const BASE_URL = import.meta.env.VITE_MERKURY_BASE_URL;

export async function loginUser(user) {
    return await axios.post(`${BASE_URL}/public/account/login`, user, {
        withCredentials: true,
    });
}

export async function registerUser(user) {
    return await axios.post(`${BASE_URL}/public/account/register`, user, {
        withCredentials: true,
    });
}

export async function sentEmailWithNewPasswordLink(email) {
    console.log("sending email...");
    return await axios.post(
        `${BASE_URL}/public/account/forgot-password`,
        email,
        {
            headers: {
                "Content-Type": "text/plain",
            },
        },
    );
}

export async function changePassword(userData) {
    return await axios.post(
        `${BASE_URL}/public/account/set-new-password`,
        userData,
    );
}

export async function logout() {
    await axios.post(
        `${BASE_URL}/account/oauth2/logout`,
        {},
        {
            withCredentials: true,
        },
    );
}

export const googleLoginUrl = `${BASE_URL}/oauth2/authorization/google`;
export const githubLoginUrl = `${BASE_URL}/oauth2/authorization/github`;
