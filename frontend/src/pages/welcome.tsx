import { useRouter } from "next/router";
import Logout from "../components/Logout";
import Quizz from "../components/Quizz";

const Welcome = ({ logout }: { logout: any }) => {
  const router = useRouter();

  return (
    <div className="quiz-bg">
      <div className="container">
        <Logout logout={logout} />
        <Quizz />
      </div>
    </div>
  );
};

export default Welcome;
