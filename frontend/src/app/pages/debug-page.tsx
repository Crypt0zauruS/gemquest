"use client"

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import SolanaService from "@/app/services/solana-service";
import "./App.css";
import { useAuth } from "@/app/hooks/useAuth";

export default function Home() {
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    // const [provider, setProvider] = useState<IProvider | null>(null);
    // const [loggedIn, setLoggedIn] = useState(false);

    const {
        initAuth,
        handleLogin,
        handleLogout,
        provider,
        loggedIn } = useAuth();


    useEffect(() => {

        const initialization = async () => {

            await initAuth();
            await handleLogin();
        };

        initialization();
    }, []);


    const addChain = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }

        const chainConfig = {
            chainId: "0x2",
            displayName: "Solana Testnet",
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            tickerName: "SOLANA",
            ticker: "SOL",
            decimals: 18,
            rpcTarget: "https://api.testnet.solana.com",
            blockExplorerUrl: "https://explorer.solana.com/?cluster=testnet",
            logo: "https://images.toruswallet.io/sol.svg",
        };

        await web3auth?.addChain(chainConfig);
        uiConsole("New Chain Added");
    };

    const switchChain = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        await web3auth?.switchChain({ chainId: "0x2" });
        uiConsole("Chain Switched");
    };

    const authenticateUser = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const idToken = await web3auth.authenticateUser();
        uiConsole(idToken);
    };

    const getUserInfo = async () => {
        if (!web3auth) {
            uiConsole("web3auth not initialized yet");
            return;
        }
        const user = await web3auth.getUserInfo();
        uiConsole(user);
    };

    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const address = await rpc.getAccounts();
        uiConsole(address);
    };

    const getBalance = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const balance = await rpc.getBalance();
        uiConsole(balance);
    };

    const sendTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const receipt = await rpc.sendTransaction();
        uiConsole(receipt);
    };

    const sendVersionTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const receipt = await rpc.sendVersionTransaction();
        uiConsole(receipt);
    };

    const signVersionedTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const receipt = await rpc.signVersionedTransaction();
        uiConsole(receipt);
    };

    const signAllVersionedTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const receipt = await rpc.signAllVersionedTransaction();
        uiConsole(receipt);
    };

    const signAllTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const receipt = await rpc.signAllTransaction();
        uiConsole(receipt);
    };

    const signMessage = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const signedMessage = await rpc.signMessage();
        uiConsole(signedMessage);
    };

    const getPrivateKey = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const rpc = new SolanaService(provider);
        const privateKey = await rpc.getPrivateKey();
        uiConsole(privateKey);
    };

    function uiConsole(...args: any[]): void {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    }

    const loggedInView = (
        <>
            <div className="flex-container">
                <div>
                    <button onClick={getUserInfo} className="card">
                        Get User Info
                    </button>
                </div>
                <div>
                    <button onClick={authenticateUser} className="card">
                        Get ID Token
                    </button>
                </div>
                <div>
                    <button onClick={addChain} className="card">
                        Add Chain
                    </button>
                </div>
                <div>
                    <button onClick={switchChain} className="card">
                        Switch Chain
                    </button>
                </div>
                <div>
                    <button onClick={getAccounts} className="card">
                        Get Account
                    </button>
                </div>
                <div>
                    <button onClick={getBalance} className="card">
                        Get Balance
                    </button>
                </div>
                <div>
                    <button onClick={sendTransaction} className="card">
                        Send Transaction
                    </button>
                </div>
                <div>
                    <button onClick={sendVersionTransaction} className="card">
                        Send Version Transaction
                    </button>
                </div>
                <div>
                    <button onClick={signVersionedTransaction} className="card">
                        Sign Versioned Transaction
                    </button>
                </div>
                <div>
                    <button onClick={signAllVersionedTransaction} className="card">
                        Sign All Versioned Transaction
                    </button>
                </div>
                <div>
                    <button onClick={signAllTransaction} className="card">
                        Sign All Transaction
                    </button>
                </div>
                <div>
                    <button onClick={signMessage} className="card">
                        Sign Message
                    </button>
                </div>
                <div>
                    <button onClick={getPrivateKey} className="card">
                        Get Private Key
                    </button>
                </div>
                <div>
                    <button onClick={handleLogout} className="card">
                        Log Out
                    </button>
                </div>
            </div>
            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
            </div>
        </>
    );

    const unloggedInView = (
        <button onClick={handleLogin} className="card">
            Login
        </button>
    );

    return (
        <div className="container">
            <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
        </div>
    );
}
