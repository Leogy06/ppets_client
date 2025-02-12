import { createContext, useContext, useEffect, useState } from "react";
import {
  useCheckUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";

// Define the type for the user
interface User {
  id: number;
  role: number;
  username: string;
  emp_id: number;
  // Add other user fields if needed
}

interface Credentials {
  username: string;
  password: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  logoutUser: () => Promise<void>;
  loginUser: (credentials: Credentials) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [login, { isLoading }] = useLoginMutation({});
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { data } = useCheckUserQuery({});

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  const loginUser = async (credentials: Credentials) => {
    const result = await login(credentials).unwrap();
    setUser(result.user);
  };

  const logoutUser = async () => {
    await logout({}); // Clear session (backend)
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, logoutUser, loginUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
