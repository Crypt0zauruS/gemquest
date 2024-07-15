import { useState } from "react";
import { IProvider } from "@web3auth/base";
import { web3auth } from "../lib/web3-auth";
import AuthService from "@/app/services/auth-service";

export const useAuth = () => {

    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const authService = new AuthService();

    const initAuth = async () => {
        try {
            await authService.initWeb3authModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async () => {

        try {
            const result = await authService.login();
            if (result) {

                setLoggedIn(result.isConnected);
                setProvider(result.web3authProvider);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {

        try {
            await web3auth.logout();
            setProvider(null);
            setLoggedIn(false);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        initAuth,
        handleLogin,
        handleLogout,
        provider,
        loggedIn,
    };

};