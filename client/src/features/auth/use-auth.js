import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { setAccessToken, setUser, logout, finishLoading } from "./auth-slice";

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const response = await api.post("/auth/refresh-token", {});
        const token = response.data?.accessToken;
        if (token && isMounted) {
          dispatch(setAccessToken(token));
          const meRes = await api.get("/auth/getMe", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (meRes.data?.user && isMounted) {
            dispatch(setUser(meRes.data.user));
          }
        }
      } catch (error) {
        if (isMounted) {
          dispatch(logout());
        }
      } finally {
        if (isMounted) {
          dispatch(finishLoading());
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useAuth;
