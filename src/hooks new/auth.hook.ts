import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
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
} from "../types/auth.types";
import type { AxiosError } from "axios";

// API
import { signup, login, verifyMe } from "../api/auth.api";

// Redux actions
import { signup as signupAction, login as loginAction } from "../global-states/slices/authSlice";

export const useSignup = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (signupPayload: CreateSignup) => signup(signupPayload),

    onSuccess: (data: SignupApiResponse) => {
      dispatch(
        signupAction({
          user: {
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
      console.log("data in login", data);

      dispatch(
        loginAction({
          user: {
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

export const useVerifyMe = (): UseQueryResult<
  VerifyMe,
  AxiosError<ErrorResponse>
> => {
  return useQuery({
    queryKey: ["verifyMe"],
    queryFn: verifyMe,
  });
};