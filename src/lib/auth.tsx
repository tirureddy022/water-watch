import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
  type StoredUser,
} from "./api";

export type SignUpPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  designation: string;
  state: string;
  district: string;
};

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignUpPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * AuthProvider — talks to the Spring Boot backend at /auth/login and /auth/signup.
 * Falls back to a local mock so the UI is fully usable in preview without the backend.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser());

  useEffect(() => {
    if (!user && getToken()) setToken(null);
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
    } catch {
      // Local fallback so preview works without the Spring Boot backend running.
      const mock: StoredUser = {
        name: email.split("@")[0] || "Operator",
        email,
        role: email.toLowerCase().startsWith("admin") ? "ADMIN" : "EMPLOYEE",
        designation: "Inspector",
      };
      setToken(`mock.${btoa(email)}.${Date.now()}`);
      setStoredUser(mock);
      setUser(mock);
    }
  }, []);

  const signup = useCallback(async (payload: SignUpPayload) => {
    try {
      const { data } = await api.post("/auth/signup", payload);
      setToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
    } catch {
      const mock: StoredUser = {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        designation: payload.designation,
        state: payload.state,
        district: payload.district,
      };
      setToken(`mock.${btoa(payload.email)}.${Date.now()}`);
      setStoredUser(mock);
      setUser(mock);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role?.toUpperCase() === "ADMIN",
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
