
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";

// Adapters
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter"; // All default Solana Adapters
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string;

const chainConfig = {
    chainId: "0x3",
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    rpcTarget: "https://api.devnet.solana.com",
    tickerName: "SOLANA",
    ticker: "SOL",
    decimals: 18,
    blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
    logo: "https://images.toruswallet.io/sol.svg",
};

console.log("Web3Auth initialized with config:", chainConfig);

const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
    config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
    // Please remove this parameter if you're on the Base Plan
    uiConfig: {
        appName: "W3A Heroes",
        mode: "light",
        // loginMethodsOrder: ["apple", "google", "twitter"],
        logoLight: "https://web3auth.io/images/web3authlog.png",
        logoDark: "https://web3auth.io/images/web3authlogodark.png",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        loginGridCol: 3,
        primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
        uxMode: "redirect",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: solanaPrivateKeyProvider,
});

// Setup external adapaters
getDefaultExternalAdapters({
    options: {
        clientId,
        chainConfig,
    },
}).then((adapters) => {
    adapters.forEach((adapter) => {
        web3auth.configureAdapter(adapter);
    })
});

export { web3auth };