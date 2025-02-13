import { createContext, useContext, useEffect, useState } from "react";
import {
  useCheckUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { useSnackbar } from "./GlobalSnackbar";

// Define the type for the user
interface User {
  id: number;
  role: number;
  username: string;
  emp_id: number;
  // Add other user fields if needed
}

interface Employee {
  ID: number;
  CURRENT_DPT_ID: number;
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
  empDetails: Employee | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [login, { isLoading }] = useLoginMutation({});
  const [user, setUser] = useState<User | null>(null);
  const [empDetails, setEmpDetails] = useState<Employee | null>(null);
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { data } = useCheckUserQuery({});

  //snackbar
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setEmpDetails(data.empDetails);
    }
  }, [data]);

  const loginUser = async (credentials: Credentials) => {
    try {
      const result = await login(credentials).unwrap();
      console.log("Result: ", result);

      setUser(result.user);
    } catch (error: any) {
      console.error(`Unable to login`, error);
      openSnackbar(error?.data?.message || "Unable to login", "error");
    }
  };

  const logoutUser = async () => {
    await logout({}); // Clear session (backend)
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, logoutUser, loginUser, isLoading, empDetails }}
    >
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
