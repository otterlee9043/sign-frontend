import { useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { apiInstance } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { getMember } from "../utils/api";
import { extractToken } from "../utils/tokenUtils";

function OAuth2LoginHandler() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const { provider } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");

  useEffect(() => {
    const login = async () => {
      try {
        const response = await apiInstance.get(`/login/oauth2/code/${provider}`, {
          params: { code: code },
        });
        const headers = response.headers;
        const accessToken = extractToken(headers["authorization"]);
        getMember(accessToken, setCurrentUser).then(() => {
          navigate("/home");
        });
      } catch (error) {
        console.error("There has been an error getMember", error);
      }
    };

    login();
  }, []);

  return null;
}

export default OAuth2LoginHandler;
