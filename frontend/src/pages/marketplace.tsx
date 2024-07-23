import { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
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
import { GiConsoleController } from "react-icons/gi";

interface LoginProps {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  provider: any;
}

interface Nft {
  metadata: any;
  address: string;
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
  const [nftByUser, setNftByUser] = useState<{
    [key: string]: number;
  }>({});

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
      const [gems, nftMetadata, gemsMetadata, nftByUser] = await Promise.all([
        rpc.fetchGems(),
        rpc.fetchNFT(),
        rpc.fetchGemsMetadata(),
        rpc.fetchNFTByUser(),
      ]);

      setUserGems(gems);
      setTotalGems(
        gems.gem1 * 1 + gems.gem5 * 5 + gems.gem10 * 10 + gems.gem20 * 20
      );
      console.log(nftMetadata);
      setNftMetadata(nftMetadata);
      setGemsMetadata(gemsMetadata);
      setNftByUser(nftByUser);
      console.table({ gems, nftMetadata, gemsMetadata, nftByUser });
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
    console.log(nft);
    setSelectedNft(nft);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedNft(null);
    setIsDetailModalOpen(false);
  };

  const handleBuyNFT = async (address: string) => {
    try {
      setLoader(true);
      const rpc = new RPC(provider);
      // const nft = Object.keys(nftMetadata).find(nft => nft.symbol == selectedNft?.symbol
      // );
      // console.log(nftMetadata[2]);
      // nftMetadata.find((nft: any) => {
      // );
      console.log(selectedNft);
      toast.loading(`Approve burning GEMS Tokens ...`, {
        theme: "dark",
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      const tx = await rpc.approveTokenBurn(
        selectedNft?.metadata?.properties?.gem_cost
      );
      toast.dismiss();
      toast.success(`Burn GEMS tokens approved ! \n`, {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });

      // TODO: Investigate, the TX is finalized but the token allowance is not updated
      // We need to wait a little
      // await new Promise(resolve => setTimeout(resolve, 5000));
      // await rpc.checkApproveToken();
      // await new Promise(resolve => setTimeout(resolve, 5000));
      // await rpc.checkApproveToken();

      toast.loading(`Minting ${selectedNft?.metadata?.name} NFT ...`, {
        theme: "dark",
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
      await rpc.burnTokenTransferNFT(
        address,
        selectedNft?.metadata?.properties?.gem_cost
      );
      toast.dismiss();
      toast.success(`NFT ! ${selectedNft?.metadata?.name} minterd \n`, {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error during NFT minting", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
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
                <hr style={{ paddingTop: "10px" }} />
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
                  <span>💎 {totalGems} GEMS 💎 </span>
                </div>
                <hr />
                <div style={{ paddingTop: "10px" }} />
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
                  Our rewards to exchange against 💎
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
                    Here you can exchange your Gems 💎 for NFTs. <br />
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
                        src={nftMetadata[key]?.metadata?.image?.replace(
                          "ipfs://",
                          ipfsGateway
                        )}
                        alt={nftMetadata[key]?.metadata?.name}
                        className={`rewardImage ${nftMetadata[key]?.metadata?.properties?.gem_cost &&
                          Number(
                            nftMetadata[key]?.metadata?.properties?.gem_cost
                          ) <= totalGems
                          ? "green"
                          : "red"
                          }`}
                      />
                      <h3>{nftMetadata[key]?.metadata?.name}</h3>
                      {nftByUser[nftMetadata[key]?.metadata?.symbol] > 0 && (
                        <h3>
                          Got:{" "}
                          <span style={{ color: "orangered" }}>
                            {nftByUser[nftMetadata[key]?.metadata?.symbol]}
                          </span>
                        </h3>
                      )}
                      <h3>
                        {nftMetadata[key]?.metadata?.properties?.gem_cost} 💎
                      </h3>
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
                  src={selectedNft?.metadata?.image?.replace(
                    "ipfs://",
                    ipfsGateway
                  )}
                  alt={selectedNft?.metadata?.name}
                  style={{
                    width: "85%",
                    height: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 0 5px 8px #000",
                  }}
                />
                <h2>{selectedNft?.metadata?.name}</h2>
                <p>Symbol: {selectedNft?.metadata?.symbol}</p>
                <p>{selectedNft?.metadata?.description}</p>
                {nftByUser[selectedNft?.metadata?.symbol] > 0 && (
                  <p>
                    Already got:
                    <span style={{ color: "orangered" }}>
                      {" "}
                      {nftByUser[selectedNft?.metadata?.symbol]}
                    </span>
                  </p>
                )}
                <p>Cost: {selectedNft?.metadata?.properties?.gem_cost} 💎</p>
                <p>
                  <button
                    className="btnResult success"
                    style={{
                      fontFamily: "Final Frontier",
                      marginTop: "10px",
                    }}
                    disabled={
                      loader ||
                      totalGems <
                      Number(selectedNft?.metadata?.properties?.gem_cost)
                    }
                    onClick={() => handleBuyNFT(selectedNft?.address)}
                  >
                    💎 Buy NFT ! 💎
                  </button>
                </p>
                <button
                  className="btnResult"
                  style={{
                    fontFamily: "Final Frontier",
                    fontSize: "0.8rem",
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
