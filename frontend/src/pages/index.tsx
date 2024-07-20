"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Loader from "../components/Loader";
import Header from "../components/Header";
import RPC from "../services/solanaRPC";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Camera from "../components/Camera";
import { sciFiThemes, messageToSign } from "../utils";
import { ToastContainer, toast } from "react-toastify";
import { useTheme } from "../lib/ThemeContext";
import SciFiSelect from "../components/SciFiSelect.tsx";

interface LoginProps {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
  provider: any;
}

const Login: React.FC<LoginProps> = ({ login, logout, loggedIn, provider }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Resistance is Futile");
  const [loader, setLoader] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    setIsSignedIn,
    isSignedIn,
  } = useTheme();
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (provider && loggedIn) {
      setLoader(true);
      try {
        const fetchInfos = async () => {
          const rpc = new RPC(provider);
          const accounts = await rpc.getAccounts();
          const address = accounts[0];
          // Handle message signing
          const signature = await rpc.signMessage(messageToSign);
          if (!signature) {
            toast.error("You must sign to enjoy GemQuest", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            logout();
            return;
          }
          setIsSignedIn(true);
          const balance = await rpc.getBalance();
          setBalance(parseFloat(balance) / LAMPORTS_PER_SOL);
          setAddress(address);
          setStatus("You have been assimilated");
        };
        fetchInfos();
      } catch (error) {
        console.error(error);
        setError("An error occurred");
        setStatus("Resistance is Futile");
        setBalance(null);
        setAddress(null);
      } finally {
        setLoader(false);
      }
    } else {
      setBalance(null);
      setAddress(null);
      setStatus("Resistance is Futile");
    }
  }, [provider, loggedIn]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowScanner(false);
  };

  const handleScanSuccess = (data: string) => {
    if (sciFiThemes.includes(data)) {
      router.push({
        pathname: "/welcome",
      });
    } else {
      setShowScanner(false);
      setTheme(undefined);
      setDifficulty("easy");
      toast.error("Invalid QR Code", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (theme) {
      handleScanSuccess(theme);
    }
  }, [theme]);

  const mintGems = async () => {

    const rpc = new RPC(provider);
    const tx = await rpc.mintGems(100);
    try {
      // if (tx) {
      //   console.log("Transaction sent: ", tx);
      // } else {
      //   console.error("Transaction failed");
      // }
      // console.log(`Minting ${gemsEarned} gems...`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="signUpLoginBox">
      <ToastContainer />
      <Header />
      <main>
        <div className="slContainer">
          <div className="formBoxLeftLogin"></div>
          <div className="formBoxRight">
            <div className="formContent">
              {error !== "" && (
                <span className="animate__animated animate__zoomInLeft">
                  {error}
                </span>
              )}

              {!loader ? (
                <h2>Status: {status} </h2>
              ) : (
                <Loader loadingMsg={undefined} styling={undefined} />
              )}

              {loggedIn && (
                <div>
                  {address && <h2>Account:</h2>}
                  <form className="inputBox">
                    {balance && address && (
                      <p>
                        {address}
                        <br />
                        <span
                          style={{
                            color: "orangered",
                            fontSize: "1.2rem ",
                            border: "none",
                          }}
                        >
                          Balance:
                        </span>{" "}
                        ${balance?.toFixed(4)} SOL
                      </p>
                    )}
                    <hr />
                    {loggedIn && (
                      <>
                        {address && (
                          <div>
                            <button
                              className="btnSubmit"
                              type="button"
                              onClick={openModal}
                              disabled={loading || !address}
                            >
                              Start a quiz !
                            </button>
                            <button
                              className="btnSubmit"
                              type="button"
                              disabled={loading || !address}
                            // onClick={()=>router.push("/marketplace")}
                            >
                              Reach your Marketplace !
                            </button>
                          </div>
                        )}
                        <button
                          className="btnSubmit"
                          type="button"
                          onClick={logout}
                        >
                          Logout
                        </button>
                        <button
                          className="btnSubmit"
                          type="button"
                          onClick={() => mintGems()}
                        >
                          MINT GEMS
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}
              {!loggedIn && (
                <div>
                  <button className="btnSubmit" type="button" onClick={login}>
                    Connect !
                  </button>

                </div>
              )}
            </div>
          </div>

          {isModalOpen && (
            <>
              <div className="overlay"></div>
              <div className="engage">
                <div className="rules">
                  <p>
                    Welcome to the GemQuest Quiz ! <br />
                    <br />
                    There are 3 levels, each level has 3 questions. <br />
                    The more you answer correctly, and the more it's difficult,
                    the more you win gems ! <br />
                    <br />
                    <span style={{ color: "orangered" }}>Warning !</span>{" "}
                    Refreshing the page, going back or Logout during the quiz
                    will reset your progression ! <br />
                    <br />
                    Choose your level, then scan the QR Code:
                  </p>
                </div>
                <SciFiSelect
                  options={["easy", "intermediate", "expert"]}
                  value={difficulty}
                  onChange={(value: string) => setDifficulty(value)}
                />
                <hr />

                {!loading ? (
                  <>
                    {!showScanner ? (
                      <button
                        className="btnSubmit"
                        type="button"
                        onClick={() => setShowScanner(true)}
                        disabled={loading || !isSignedIn}
                      >
                        Scan
                      </button>
                    ) : (
                      <div className="camera-container">
                        <Camera />
                      </div>
                    )}
                    <button
                      className="btnSubmit"
                      type="button"
                      onClick={closeModal}
                    >
                      I&apos;m Feared
                    </button>
                  </>
                ) : (
                  <Loader loadingMsg={undefined} styling={undefined} />
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
