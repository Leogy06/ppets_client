import { createContext, useContext, useEffect, useState } from "react";
import {
  useCheckUserQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { useSnackbar } from "./GlobalSnackbar";
import { Credentials, Employee, User } from "@/types/global_types";

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

  //use effect
  useEffect(() => {
    if (data) {
      setUser(data.user);
      setEmpDetails(data.empDetails);
      console.log("Use effect in use auth has been executed.");
    }
  }, [data]);

  const loginUser = async (credentials: Credentials) => {
    try {
      const result = await login(credentials).unwrap();

      setUser(result.user);
      setEmpDetails(result.empDetails);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        openSnackbar(err.data?.message || "Unable to login", "error");
      } else {
        openSnackbar("Unable to login", "error");
      }
      console.error(`Unable to login`, error);
    }
  };

  const logoutUser = async () => {
    await logout({}); // Clear session (backend)
    setUser(null); //clear user
    setEmpDetails(null);
    router.push("/");
  };

  if (isLoading) return "Loading...";

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
