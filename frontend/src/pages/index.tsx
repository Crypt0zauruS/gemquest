// index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Loader from "../components/Loader";
import Header from "../components/Header";
import RPC from "../components/solanaRPC";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

  useEffect(() => {
    if (provider && loggedIn) {
      setLoader(true);
      try {
        const fetchBalance = async () => {
          const rpc = new RPC(provider);
          const balance = await rpc.getBalance();
          setBalance(parseFloat(balance) / LAMPORTS_PER_SOL);
          const accounts = await rpc.getAccounts();
          const address = accounts[0];
          setAddress(address);
          setStatus("You have been assimilated");
          setLoader(false);
        };
        fetchBalance();
      } catch (error) {
        console.error(error);
        setError("An error occurred");
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
  };

  return (
    <div className="signUpLoginBox">
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
                  <h2>Account:</h2>
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
                        <button
                          className="btnSubmit"
                          type="button"
                          onClick={openModal}
                        >
                          Start a quiz !
                        </button>
                        <button
                          className="btnSubmit"
                          type="button"
                          // onClick={()=>router.push("/marketplace")}
                        >
                          Reach your Marketplace !
                        </button>
                        <button
                          className="btnSubmit"
                          type="button"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </form>
                </div>
              )}
              {!loggedIn && (
                <button className="btnSubmit" type="button" onClick={login}>
                  Connect !
                </button>
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
                    The more you answer correctly, the more you win gems !{" "}
                    <br />
                    <br />
                    Warning ! Changing account, network, refreshing, back to
                    login page or Logout during the quiz will reset your
                    progression ! <br />
                    <br />
                    GOOD LUCK !
                  </p>
                </div>
                <hr />
                {!loading ? (
                  <>
                    <button
                      className="btnSubmit"
                      type="button"
                      onClick={() => {
                        router.push("/welcome");
                        setLoading(true);
                      }}
                    >
                      Engage !
                    </button>
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
