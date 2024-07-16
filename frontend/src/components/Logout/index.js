import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip-rc";
import { useRouter } from "next/router";

const Logout = ({ logout }) => {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (checked) {
      logout();
      router.push("/");
      router.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <div className="logoutContainer">
      <p className="logoutText">Logout & RESET</p>

      <label className="switch">
        <input onChange={handleChange} type="checkbox" checked={checked} />
        <span className="slider round" data-tip={`Reset the quiz`}></span>
      </label>
      <ReactTooltip place="left" effect="solid" />
    </div>
  );
};

export default Logout;
