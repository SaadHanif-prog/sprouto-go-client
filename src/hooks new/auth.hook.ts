import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

// Types
import type {
  CreateSignup,
  CreateLogin,
  ErrorResponse,
  SignupApiResponse,
  LoginApiResponse,
  VerifyMe,
  GetAllUsersApiResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/src/types/auth.types";
import type { AxiosError } from "axios";

// API
import {
  signup,
  login,
  verifyMe,
  logout,
  getAllUsers,
  resetPassword,
  forgotPassword,
} from "@/src/api/auth.api";

// Redux actions
import {
  signup as signupAction,
  login as loginAction,
  logout as logoutAction,
} from "@/src/global-states/slices/authSlice";

export const useSignup = () => {

  return useMutation({
    mutationFn: (signupPayload: CreateSignup) => signup(signupPayload),

    onSuccess: (data: SignupApiResponse) => {
      toast.success(data.message || "Signup Successful.");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (loginPayload: CreateLogin) => login(loginPayload),

    onSuccess: (data: LoginApiResponse) => {
      const queryClient = new QueryClient();

      queryClient.invalidateQueries({ queryKey: ["sites"] });

      dispatch(
        loginAction({
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
            accessToken: data.data.accessToken || "",
            isPaymentPlanActive: data.data.isPaymentPlanActive || false,

          },
        }),
      );

      toast.success(data.message || "Login Successful.");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
    },
    onError: () => {
      toast.error("Logout failed. Please try again.");
    },
  });
};

export const useVerifyMe = (): UseQueryResult<
  VerifyMe,
  AxiosError<ErrorResponse>
> => {
  return useQuery({
    queryKey: ["verifyMe"],
    queryFn: verifyMe,
    retry: false
  });
};

export const useGetAllUsers = (): UseQueryResult<
  GetAllUsersApiResponse,
  AxiosError<ErrorResponse>
> => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};


// ================= FORGOT PASSWORD =================
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      forgotPassword(payload),

    onSuccess: (data: ForgotPasswordResponse) => {
      toast.success(data.message || "Reset link sent.");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};


// ================= RESET PASSWORD =================
export const useResetPassword = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      payload,
    }: {
      token: string;
      payload: ResetPasswordPayload;
    }) => resetPassword(token, payload),

    onSuccess: async (data: ResetPasswordResponse) => {
      toast.success(data.message || "Password reset successful.");

      try {
        // 🔥 clear cookies from backend
        await logout();
      } catch (e) {
        // even if logout fails, continue cleanup
        console.warn("Logout after reset failed");
      }

      dispatch(logoutAction());

      // 🔥 clear all cached queries
      queryClient.clear();

      // 🔥 force ProtectedRoute to re-evaluate
      window.location.reload();
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

