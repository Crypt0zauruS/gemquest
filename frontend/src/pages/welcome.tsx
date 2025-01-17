import { useEffect, useState, useCallback, useMemo } from "react";
import Logout from "../components/Logout";
import Quizz from "../components/Quizz";
import { useTheme } from "../lib/ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import gemQuest from "../images/gemquest.webp";
import Loader from "../components/Loader";

const Welcome = ({
  logout,
  provider,
}: {
  logout: () => void;
  provider: any;
}) => {
  const { theme, setTheme, difficulty, setDifficulty, isSignedIn } = useTheme();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  const generateQuiz = useCallback(async () => {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme, difficulty }),
      });

      const data = await response.json();
      if (response.ok) {
        setQuizData(data.quiz);
        console.log("quizData after setting:");
      } else {
        console.error("Failed to generate quiz:");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    const fetchData = async () => {
      if (theme) {
        await generateQuiz();
        setLoading(false);
      } else {
        toast.error(
          "No quiz available, please check back later or contact support",
          {
            theme: "dark",
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          }
        );
        router.push("/");
      }
    };
    fetchData();
  }, [theme, generateQuiz]);

  // Ensure the component is hydrated before rendering
  useEffect(() => {
    setHydrated(true);
    if (!isSignedIn) {
      logout();
      router.push("/");
    }
  }, []);

  const handleQuit = () => {
    setHydrated(false);
    setTheme(undefined);
    setDifficulty("easy");
    setQuizData(null);
    logout();
    router.push("/");
  };

  const memoizedQuizData = useMemo(() => quizData, [quizData]);

  useEffect(() => {
    console.log("quizData updated:");
  }, [memoizedQuizData]);

  // Handle back button behavior
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      console.log("Back button pressed");
      setTheme(undefined);
      setDifficulty("easy");
      setQuizData(null);
      logout();
      router.push("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [logout, router]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="quiz-bg">
      <ToastContainer />
      {isSignedIn ? (
        <div className="container">
          <Logout logout={logout} />
          {loading ? (
            <Loader
              loadingMsg={"Generating quiz..."}
              styling={{
                color: "skyblue",
                fontSize: "2rem",
                textAlign: "center",
              }}
            />
          ) : (
            <Quizz
              quizData={memoizedQuizData}
              provider={provider}
              setQuizData={setQuizData}
              logout={logout}
            />
          )}
        </div>
      ) : (
        <div className="formContent">
          <button
            className="btnSubmit"
            style={{ marginTop: "50px", marginBottom: "30px" }}
            type="button"
            onClick={handleQuit}
          >
            Main Menu
          </button>

          <img
            src={gemQuest.src}
            alt="GemQuest"
            style={{
              display: "block",
              maxWidth: "600px",
              width: "90%",
              margin: "0 auto",
              borderRadius: "10px",
              boxShadow: "0 0 5px 5px skyblue",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Welcome;
