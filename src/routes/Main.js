import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavLinkButton from "../components/NavLinkButton";

import Logo from "../logo_big.svg";
import { apiInstance, authApiInstance } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { extractToken } from "../utils/tokenUtils";
import { getMember } from "../utils/api";
import styles from "./Main.module.css";


function Main() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await apiInstance.post('/refresh/access-token');
        if (response.data === "") {  
          const newAccessToken = extractToken(response.headers["authorization"]);
          getMember(newAccessToken, setCurrentUser).then(() => {
            navigate("/home");
          });
        } 
      } catch (error) {
        console.log(error);
      }
    }

    checkLoggedIn();
  }, []);

  return (
    <div>
      <div className={styles.top}>
        <img className={styles.logo} src={Logo} alt="logo" />
      </div>
      <div className={styles.bottom}>
        <NavLinkButton path="login" text="Start" type="start" />
      </div>
    </div>
  );
}

export default Main;
