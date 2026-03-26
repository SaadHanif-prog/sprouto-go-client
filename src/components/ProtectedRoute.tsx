import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyMe } from "@/src/hooks new/auth.hook";
import { setUser } from "@/src/global-states/slices/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Login from "./Login";
import { RootState } from "../global-states/store";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export type Tab =
  | "dashboard"
  | "requests"
  | "targets"
  | "auditor"
  | "plans"
  | "superadmin"
  | "profile";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [activeTab, setActiveTab] = useLocalStorage<Tab>(
    "sprouto_tab",
    "dashboard",
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;

  const dispatch = useDispatch();

  const { data, isSuccess, isError, isLoading: isApiLoading } = useVerifyMe();

  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(
        setUser({
          user: {
            firstname: data.data.firstname,
            surname: data.data.surname,
            email: data.data.email,
            role: data.data.role,
          },
        }),
      );
    }
  }, [isSuccess, data, dispatch]);

  const showLoading = isApiLoading || isTransitioning;

  if (!user) {
    return (
      <Login
        onLogin={() => {
          if (userRole === "superadmin") {
            setActiveTab("superadmin");
          } else {
            setActiveTab("dashboard");
          }
        }}
      />
    );
  } else {
    return <>{children}</>;
  }
};
export default ProtectedRoute;
