import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <header>
      <div className="banner-container">
        <h1 onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          GemQuest
        </h1>

        {isHomePage && (
          <>
            <hr />
            <h4>
              Test your knowledge of the Sci-Fi universes to win 💎
              <br /> And exchange them for rewards!
            </h4>
            <hr />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
