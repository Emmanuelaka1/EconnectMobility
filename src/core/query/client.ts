import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // évite des refetch trop agressifs, à adapter
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 200_000,
    },
  },
});

export default queryClient;
