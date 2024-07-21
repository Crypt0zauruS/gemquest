import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import RPC from "../services/solanaRPC";
import { gemMetadataAccounts, ipfsGateway } from "../utils";
import {
  mplTokenMetadata,
  fetchDigitalAssetByMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import Logout from "../components/Logout";

interface LoginProps {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  provider: any;
}

const Marketplace: React.FC<LoginProps> = ({ logout, loggedIn, provider }) => {
  const [totalGems, setTotalGems] = useState(0);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loader, setLoader] = useState(false);
  const [userGems, setUserGems] = useState<{
    [key: string]: number;
  }>({
    gem1: 0,
    gem5: 0,
    gem10: 0,
    gem20: 0,
  });
  const [gemsMetadata, setGemsMetadata] = useState<{
    gem1: any;
    gem5: any;
    gem10: any;
    gem20: any;
  }>({
    gem1: {},
    gem5: {},
    gem10: {},
    gem20: {},
  } as { gem1: any; gem5: any; gem10: any; gem20: any });
  const umi = createUmi("https://api.devnet.solana.com").use(
    mplTokenMetadata()
  );
  const router = useRouter();

  useEffect(() => {
    if (loggedIn && provider) {
      fetchUserGems();
      fetchGemsMetadata();
    } else {
      setUserGems({
        gem1: 0,
        gem5: 0,
        gem10: 0,
        gem20: 0,
      });
      logout();
      router.push("/");
    }
  }, [loggedIn, provider]);

  const fetchUserGems = async () => {
    setLoader(true);
    try {
      const rpc = new RPC(provider);
      const gems = await rpc.fetchGems();
      setUserGems(gems);
      console.log("User gems:", gems);
      setTotalGems(
        gems.gem1 * 1 + gems.gem5 * 5 + gems.gem10 * 10 + gems.gem20 * 20
      );
    } catch (err) {
      setError("Failed to fetch user gems");
    } finally {
      setLoader(false);
    }
  };

  const fetchGemsMetadata = async () => {
    setLoader(true);
    try {
      const getMetadata = async (metadataAccount: string) => {
        const metadataPDA: any = [new PublicKey(metadataAccount), 0];
        const asset = await fetchDigitalAssetByMetadata(umi, metadataPDA);
        return asset;
      };
      const gem1Metadata = await getMetadata(gemMetadataAccounts[1]);
      const gem5Metadata = await getMetadata(gemMetadataAccounts[5]);
      const gem10Metadata = await getMetadata(gemMetadataAccounts[10]);
      const gem20Metadata = await getMetadata(gemMetadataAccounts[20]);

      const gemsMetadataUrls = {
        gem1: gem1Metadata.metadata.uri,
        gem5: gem5Metadata.metadata.uri,
        gem10: gem10Metadata.metadata.uri,
        gem20: gem20Metadata.metadata.uri,
      };

      // Function to fetch JSON data from IPFS
      const fetchJsonFromIpfs = async (url: string) => {
        const response = await fetch(url.replace("ipfs://", ipfsGateway));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      };

      const gem1Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem1);
      const gem5Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem5);
      const gem10Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem10);
      const gem20Data = await fetchJsonFromIpfs(gemsMetadataUrls.gem20);

      setGemsMetadata({
        gem1: gem1Data,
        gem5: gem5Data,
        gem10: gem10Data,
        gem20: gem20Data,
      });
      console.log("Gems metadata:", gemsMetadata);
    } catch (err) {
      setError("Failed to fetch gem metadata");
    } finally {
      setLoader(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      console.log("Back button pressed");
      setTotalGems(0);
      setGemsMetadata({
        gem1: {},
        gem5: {},
        gem10: {},
        gem20: {},
      });
      setUserGems({
        gem1: 0,
        gem5: 0,
        gem10: 0,
        gem20: 0,
      });

      logout();
      router.push("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [logout, router]);

  return (
    <div>
      <Logout logout={logout} />
      <ToastContainer />
      <Header />

      <main>
        <div className="marketplaceContainer">
          <div className="marketplaceContent">
            {error && (
              <span className="animate__animated animate__zoomInLeft">
                {error}
              </span>
            )}

            {loader && <Loader loadingMsg={undefined} styling={undefined} />}
            {loggedIn && !loader && (
              <div>
                <p className="rules">Welcome to the Marketplace!</p>
                <hr />
                <div className="gemsContainer">
                  {userGems?.gem1 > 0 && (
                    <div className="gemItem">
                      <img
                        src={gemsMetadata?.gem1?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt="Gem 1"
                        className="gemImage"
                      />
                      <div className="gemCount">{userGems?.gem1}</div>
                    </div>
                  )}
                  {userGems?.gem5 > 0 && (
                    <div className="gemItem">
                      <img
                        src={gemsMetadata?.gem5?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt="Gem 5"
                        className="gemImage"
                      />
                      <div className="gemCount">{userGems?.gem5}</div>
                    </div>
                  )}
                  {userGems?.gem10 > 0 && (
                    <div className="gemItem">
                      <img
                        src={gemsMetadata?.gem10?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt="Gem 10"
                        className="gemImage"
                      />
                      <div className="gemCount">{userGems?.gem10}</div>
                    </div>
                  )}
                  {userGems?.gem20 > 0 && (
                    <div className="gemItem">
                      <img
                        src={gemsMetadata?.gem20?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt="Gem 20"
                        className="gemImage"
                      />
                      <div className="gemCount">{userGems?.gem20}</div>
                    </div>
                  )}
                </div>

                <div className="totalGems">
                  <span>Total gems: {totalGems}</span>
                </div>
                <hr />
              </div>
            )}
          </div>

          {isModalOpen && loggedIn && (
            <>
              <div className="overlay"></div>
              <div className="engage">
                <div className="rules">
                  <p>
                    Welcome to the Marketplace!
                    <br />
                    Here you can exchange you gems for NFTs. <br />
                    Each NFT can be exchanged for free stuffs in the park
                  </p>
                </div>
                <button
                  className="btnSubmit"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
