import { useQuery } from "@tanstack/react-query";
import { getReplays } from "../services/apiComments";

function useGetReplays(id) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["replays", id],
    queryFn: () => getReplays(id),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });

  return { isLoading, data, error };
}

export default useGetReplays;
