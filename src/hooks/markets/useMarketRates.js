import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMarketRates } from "../../services/apiMarkets";

function useMarketRates() {
  const { id } = useParams();

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["marketRates", id],
    queryFn: () => getMarketRates(id),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { isLoading, data, error, refetch };
}

export default useMarketRates;
