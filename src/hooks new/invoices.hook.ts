import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getMyInvoices } from "@/src/api/invoices.api";
import type { GetMyInvoicesResponse } from "@/src/api/invoices.api";
import type { ErrorResponse } from "@/src/types/auth.types";

export const useGetMyInvoices = (): UseQueryResult<
  GetMyInvoicesResponse,
  AxiosError<ErrorResponse>
> => {
  return useQuery({
    queryKey: ["myInvoices"],
    queryFn: getMyInvoices,
    staleTime: 1000 * 60 * 5, // 5 minutes — invoices don't change often
  });
};