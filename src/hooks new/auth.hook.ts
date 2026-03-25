import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

// Types
import type {CreateSignup, CreateLogin, ErrorResponse, SignupApiResponse, LoginApiResponse, VerifyMe} from "../types/auth.types";
import type { AxiosError } from "axios";

// Hooks
import { signup, login, verifyMe } from "../api/auth.api";

// Actions from redux store
import { signup as signupAction, login as loginAction } from "../global-states/slices/authSlice";

export const useSignup = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (signupPayload: CreateSignup) => signup(signupPayload),
    onSuccess: (data: SignupApiResponse) => {
      dispatch(
        signupAction({
          user: {
            username: data.data.username,
            email: data.data.email,
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
        console.log("data in login", data)
      dispatch(
        loginAction({
          user: {
            username: data.data.username,
            email: data.data.email,
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


export const useVerifyMe = (): UseQueryResult<VerifyMe, AxiosError<ErrorResponse>> => {
  return useQuery<VerifyMe, AxiosError<ErrorResponse>>({
    queryKey: ["verifyMe"], 
    queryFn: verifyMe,
  });
};
