import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyMe } from "@/src/hooks new/auth.hook";
import { setUser } from "@/src/global-states/slices/authSlice";
import Login from "./Login";
import { RootState } from "../global-states/store";

type ProtectedRouteProps = {
  children: React.ReactNode;
  setActiveTab: any;
};

export type Tab =
  | "dashboard"
  | "requests"
  | "targets"
  | "auditor"
  | "plans"
  | "superadmin"
  | "profile";

const ProtectedRoute = ({ children, setActiveTab }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;
  const dispatch = useDispatch();

  const { data, isSuccess } = useVerifyMe();

  useEffect(() => {
  if (isSuccess && data?.data) {
    dispatch(
      setUser({
        user: {
          userId: data.data.id,
          firstname: data.data.firstname,
          surname: data.data.surname,
          email: data.data.email,
          role: data.data.role,
          companyName: data.data.company?.name || "",
          companyNumber: data.data.company?.number || "",
          addressLine1: data.data.address?.line1 || "",
          city: data.data.address?.city || "",
          county: data.data.address?.county || "",
          postcode: data.data.address?.postcode || "",
          addonentitlementid: data.data.addonentitlementid ?? null,
          accessToken: data.data.accessToken || "",
          isPaymentPlanActive: data.data.isPaymentPlanActive || false,
        },
      })
    );
  }
}, [isSuccess, data, dispatch ]); 


  if (!user || !user.isPaymentPlanActive) {
    return (
      <Login
        onLogin={() => {
          setActiveTab(userRole === "superadmin" ? "superadmin" : "sites");
        }}
        setActiveTab={setActiveTab}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;