import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
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
} from "@/src/types/auth.types";
import type { AxiosError } from "axios";

// API
import { signup, login, verifyMe, logout, getAllUsers } from "@/src/api/auth.api";

// Redux actions
import {
  signup as signupAction,
  login as loginAction,
  logout as logoutAction,
} from "@/src/global-states/slices/authSlice";

export const useSignup = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (signupPayload: CreateSignup) => signup(signupPayload),

    onSuccess: (data: SignupApiResponse) => {
      dispatch(
        signupAction({
          user: {
            userId: data.data.id, 
            firstname: data.data.firstname,
            surname: data.data.surname,
            email: data.data.email,
            role: data.data.role,
          },
        })
      );

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
      dispatch(
        loginAction({
          user: {
            userId: data.data.id, // ✅ added
            firstname: data.data.firstname,
            surname: data.data.surname,
            email: data.data.email,
            role: data.data.role,
          },
        })
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