import { useRouter } from "next/router";
import { useEffect } from "react";

const Header = () => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  return (
    <header>
      <div className="banner-container">
        <h1>GemQuest</h1>

        {isHomePage && (
          <>
            <hr />
            <h4>
              Manage your amusement park tickets and get free stuff! <br />
              Test your knowledge of the Sci-Fi universes to win gems!
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
