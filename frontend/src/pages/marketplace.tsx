import { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useRouter } from "next/router";
import RPC from "../services/solanaRPC";
import { ipfsGateway } from "../utils";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import Logout from "../components/Logout";

interface LoginProps {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  provider: any;
}

interface Nft {
  name: string;
  image: string;
  symbol?: string;
  description?: string;
  properties?: {
    gem_cost?: number;
  };
}

const Marketplace: React.FC<LoginProps> = ({ logout, loggedIn, provider }) => {
  const router = useRouter();

  const [totalGems, setTotalGems] = useState(0);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);
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
    gem1?: any;
    gem5?: any;
    gem10?: any;
    gem20?: any;
  }>({});
  const umi = createUmi("https://api.devnet.solana.com").use(
    mplTokenMetadata()
  );

  const [nftMetadata, setNftMetadata] = useState<{
    [key: string]: any;
  }>({});

  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);

  const openRewardsModal = () => {
    setIsRewardsModalOpen(true);
  };

  const closeRewardsModal = () => {
    setIsRewardsModalOpen(false);
  };

  useEffect(() => {
    if (loggedIn && provider) {
      fetchData();
    } else {
      resetData();
      logout();
      router.push("/");
    }
  }, [loggedIn, provider]);

  const fetchData = useCallback(async () => {
    setLoader(true);
    try {
      const rpc = new RPC(provider);
      const [gems, nftMetadata, gemsMetadata] = await Promise.all([
        rpc.fetchGems(),
        rpc.fetchNFT(),
        rpc.fetchGemsMetadata(),
      ]);

      setUserGems(gems);
      setTotalGems(
        gems.gem1 * 1 + gems.gem5 * 5 + gems.gem10 * 10 + gems.gem20 * 20
      );
      setNftMetadata(nftMetadata);
      setGemsMetadata(gemsMetadata);
      console.table({ gems, nftMetadata, gemsMetadata });
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoader(false);
    }
  }, [provider]);

  const resetData = () => {
    setUserGems({
      gem1: 0,
      gem5: 0,
      gem10: 0,
      gem20: 0,
    });
    setNftMetadata({});
    setGemsMetadata({
      gem1: {},
      gem5: {},
      gem10: {},
      gem20: {},
    });
    setTotalGems(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDetailModal = (nft: any) => {
    setSelectedNft(nft);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedNft(null);
    setIsDetailModalOpen(false);
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
      <div style={{ marginTop: "15px" }}>
        <Logout logout={logout} />
      </div>
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
                <h3
                  className="modalContentNft"
                  style={{
                    fontFamily: "Final Frontier",
                    width: "350px",
                    fontSize: "1.5rem",
                    margin: "0 auto",
                  }}
                >
                  Welcome to the Marketplace !
                </h3>
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
                <p
                  className="modalContentNft"
                  style={{
                    fontFamily: "Final Frontier",
                    color: "orangered",
                    width: "350px",
                    fontSize: "1.4rem",
                    margin: "0 auto",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                  onClick={openRewardsModal}
                >
                  Our rewards to exchange against gems
                </p>
              </div>
            )}
          </div>

          {isModalOpen && loggedIn && (
            <>
              <div className="overlay"></div>
              <div className="engage" style={{ maxHeight: "300px" }}>
                <div className="rules" style={{ marginTop: "30px" }}>
                  <p>
                    <span
                      style={{
                        display: "block",
                        fontFamily: "Final Frontier",
                        fontSize: "1.5rem",
                        color: "skyblue",
                        marginBottom: "15px",
                      }}
                    >
                      Welcome to the Marketplace !
                    </span>
                    <br />
                    Here you can exchange you gems for NFTs. <br />
                    Each NFT can be exchanged for free stuffs in the park
                  </p>
                </div>
                <button
                  className="btnSubmit"
                  type="button"
                  style={{ marginTop: "30px" }}
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </>
          )}
          {isRewardsModalOpen && (
            <div className="modalnft">
              <div className="modalContentNft">
                <div>
                  <h4 style={{ textAlign: "center", margin: "5px" }}>
                    Exchange those in green ! <br />
                    You have {totalGems} gems
                  </h4>
                </div>
                <hr />
                <div className="rewardsContainer">
                  {Object.keys(nftMetadata).map((key) => (
                    <div
                      key={key}
                      className="rewardItem"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetailModal(nftMetadata[key])}
                    >
                      <img
                        src={nftMetadata[key]?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt={nftMetadata[key]?.name}
                        className={`rewardImage ${
                          nftMetadata[key]?.properties?.gem_cost &&
                          Number(nftMetadata[key]?.properties?.gem_cost) <=
                            totalGems
                            ? "green"
                            : "red"
                        }`}
                      />
                      <h3>{nftMetadata[key]?.name}</h3>
                      <h3>{nftMetadata[key]?.properties?.gem_cost} gems</h3>
                    </div>
                  ))}
                </div>
                <button
                  className="btnResult success"
                  onClick={closeRewardsModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {isDetailModalOpen && selectedNft && (
            <div className="modalnft">
              <div className="modalContentNft">
                <img
                  src={selectedNft?.image?.replace("ipfs://", ipfsGateway)}
                  alt={selectedNft?.name}
                  style={{
                    width: "85%",
                    height: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 0 5px 8px #000",
                  }}
                />
                <h2>{selectedNft?.name}</h2>
                <p>Symbol: {selectedNft?.symbol}</p>
                <p>{selectedNft?.description}</p>
                <p>Cost: {selectedNft?.properties?.gem_cost} gems</p>
                <button
                  className="btnResult"
                  style={{
                    fontFamily: "Final Frontier",
                    fontSize: "0.8rem",
                    height: "30px",
                    marginTop: "10px",
                  }}
                  onClick={closeDetailModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
