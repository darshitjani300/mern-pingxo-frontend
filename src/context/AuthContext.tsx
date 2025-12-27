import { createContext, useContext, useEffect, useState } from "react";
import axiosInstace from "../api/axios/axiosInstance";
import { saveCachedUser } from "../utils/cache";
import { getProfileApi } from "../api/profile";
import { userProfile } from "../redux/features/chat/chat.slice";
import { useAppDispatch } from "../types/reduxHooks";

type AuthContextType = {
  user: any;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const checkAuth = async () => {
    setLoading(true);

    try {
      const res = await axiosInstace.get("/v1/auth/me");
      setUser(res.data.user || null);
      saveCachedUser(res.data.user);
    } catch (error) {
      setUser(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfileApi();
      const profile = res.data.profile;

      if (!profile) {
        return;
      }

      dispatch(userProfile(profile));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      fetchProfile();
    }
  }, [loading, user]);

  return (
    <AuthContext.Provider
      value={
        {
          user,
          loading,
          checkAuth,
        } as any
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
