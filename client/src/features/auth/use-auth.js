import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAccessToken, setUser, logout, finishLoading } from "./auth-slice";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axios.get(
          "/api/auth/session",
          {},
          {
            withCredentials: true,
          },
        );
        dispatch(setAccessToken(response.data?.accessToken));
        const meRes = await axios.get("http://localhost:3000/api/auth/me", {
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
  }, [dispatch]);
};

export default useAuth;
