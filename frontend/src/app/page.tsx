"use client"

import { useEffect, useState } from "react";
import { Spinner, Center, Button } from "@chakra-ui/react";
import SolanaService from "@/app/services/solana-service";
import "./App.css";
import { useAuth } from "@/app/hooks/useAuth";

export default function Home() {
  const [isLogging, setIsLogging] = useState(true);

  const {
    initAuth,
    handleLogin,
    handleLogout,
    provider,
    loggedIn } = useAuth();


  useEffect(() => {

    const initialization = async () => {

      setIsLogging(true);
      await initAuth();
      await handleLogin();
      setIsLogging(false);
    };

    initialization();
  }, []);


  const loggedInView = (
    <>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
        <Button onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      {isLogging ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Button onClick={handleLogin}>
          Login
        </Button>
      )}
    </>
  );

  return (
    <div className="container">
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </div>
  );
}
