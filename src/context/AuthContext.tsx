import { createContext, useContext, useEffect, useState } from "react";
import {
  useCheckUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";

// Define the type for the user
interface User {
  role: number;
  username: string;
  user: {
    id: number;
    role: number;
  };
  // Add other user fields if needed
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  logoutUser: () => Promise<void>;
  loginUser: (params: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [login] = useLoginMutation({});
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { data, isLoading } = useCheckUserQuery({});

  useEffect(() => {
    if (data) {
      setUser(data.user);
    }
  }, [data]);

  const loginUser = async (credentials: any) => {
    const result = await login(credentials).unwrap();
    setUser(result);
  };

  const logoutUser = async () => {
    await logout({}); // Clear session (backend)
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, logoutUser, loginUser }}>
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
