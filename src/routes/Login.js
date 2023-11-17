import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance, authApiInstance } from "../utils/api";

import Logo from "../logo_big.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import styles from "./Login.module.css";
import { getMember } from "../utils/api";
import { extractToken } from "../utils/tokenUtils";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setMessage] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const handleClick = async () => {
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      const headers = response.headers;
      const accessToken = extractToken(headers["authorization"]) 
      getMember(accessToken, setCurrentUser).then(() => {
        navigate("/home");
      });
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") handleClick();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.login}>
        <img className={styles.logo} src={Logo} alt="logo" />
        {errorMsg === "" ? null : <div className={styles.errorMsg}>{errorMsg}</div>}
        <div className={styles["login-form"]}>
          <div className={styles["input-wrapper"]}>
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={styles["input-wrapper"]}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleOnKeyPress}
            />
          </div>
          <button
            className={`${styles["login-button"]} ${styles["login-button-blue"]}`}
            onClick={handleClick}
          >
            로그인
          </button>
          <br></br>
          <button className={`${styles["login-button"]} ${styles["login-google"]}`}>
            <a
              href={`${process.env.REACT_APP_OAUTH_LOGIN_URL}/google`}
              className={styles["login-google"]}
            >
              구글 로그인
            </a>
          </button>

          <button className={`${styles["login-button"]} ${styles["login-kakao"]}`}>
            <a
              href={`${process.env.REACT_APP_OAUTH_LOGIN_URL}/kakao`}
              className={styles["login-kakao"]}
            >
              카카오 로그인
            </a>
          </button>

          <div className={styles.signup}>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
