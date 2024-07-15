import { web3auth } from "@/app/lib/web3-auth";
import { IProvider } from "@web3auth/base";

export default class AuthService {

  initWeb3authModal = async (): Promise<boolean> => {
    try {

      console.log("Web3Auth modal initialization");

      await web3auth.initModal();
      console.log("Web3Auth modal is now initialized");
      console.log("Web3Auth modal user already connected: ", web3auth.connected);
      return web3auth.connected;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  login = async (): Promise<{
    isConnected: boolean;
    web3authProvider: IProvider | null;
  } | undefined> => {

    console.log("Web3Auth login requested");
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }

    const web3authProvider = await web3auth.connect();
    const isConnected = web3auth.connected;

    console.log("Web3Auth login completed with provider:", web3authProvider);
    return { isConnected, web3authProvider };
  };

  logout = async (): Promise<void> => {
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }
    console.log("Web3Auth logout requested");
    await web3auth.logout();
    console.log("Web3Auth logout completed");
  };

}
