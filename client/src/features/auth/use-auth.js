import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAccessToken, setUser, logout, finishLoading } from "./auth-slice";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          {},
          {
            withCredentials: true,
          },
        );
        dispatch(setAccessToken(response.data?.accessToken));
        const meRes = await axios.get("http://localhost:5000/api/auth/getMe", {
          headers: {
            Authorization: `Bearer ${response.data?.accessToken}`,
          },
          withCredentials: true,
        });
        dispatch(setUser(meRes.data?.user));
      } catch (error) {
        console.error("Session restoration failed:", error);
        dispatch(logout());
      } finally {
        dispatch(finishLoading());
      }
    };
    restoreSession();
  }, [dispatch]);
};

export default useAuth;
