// _app.tsx
import "@/styles/globals.css";
import "@/styles/app.css";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { IconContext } from "react-icons";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";

export default function App({ Component, pageProps }: AppProps) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const chainConfig = {
    chainId: "103",
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    rpcTarget: "https://api.devnet.solana.com",
    tickerName: "SOLANA",
    ticker: "SOL",
    decimals: 9,
    blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
    logo: "https://images.toruswallet.io/sol.svg",
  };

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch("/api/web3auth");
        const data = await response.json();
        const clientId = data.clientId;
        const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig: chainConfig },
        });

        const web3auth = new Web3Auth({
          clientId,
          uiConfig: {
            appName: "GemQuest",
            mode: "dark",
            logoLight: "https://web3auth.io/images/web3authlog.png",
            logoDark: "https://web3auth.io/images/web3authlogodark.png",
            defaultLanguage: "en",
            loginGridCol: 3,
            primaryButton: "externalLogin",
            uxMode: "redirect",
          },
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: solanaPrivateKeyProvider,
        });

        const adapters = await getDefaultExternalAdapters({
          options: {
            clientId,
            chainConfig,
          },
        });
        adapters.forEach((adapter) => {
          web3auth.configureAdapter(adapter);
        });

        setWeb3auth(web3auth);
        if (!web3auth) {
          console.error("Web3Auth is not initialized");
          return;
        }
        try {
          await web3auth.initModal();
          setProvider(web3auth.provider);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "User closed the modal"
          ) {
            console.log("User closed the modal. No action needed.");

            return;
          } else {
            console.error("An error occurred during initModal:", error);

            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();

    if (web3auth.connected) {
      setLoggedIn(true);
      setProvider(web3authProvider);
    } else {
      console.error("Web3Auth is not connected");
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  return (
    <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Win gems, manage your amusement park rewards"
        />
        <meta name="author" content="GemQuest Team" />
        <link rel="icon" href="/favicon.ico" />
        <title>GemQuest</title>
      </Head>
      <Component
        {...pageProps}
        login={login}
        logout={logout}
        loggedIn={loggedIn}
        provider={provider}
      />
    </IconContext.Provider>
  );
}
