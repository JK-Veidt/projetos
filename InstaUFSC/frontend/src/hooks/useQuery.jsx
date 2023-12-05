import { useLocation } from "react-router-dom";
import { useMemo } from "react";
export const useQuery = () => {
  const { search } = useLocation();
  //permite a extração dos dados como objetos e monitora a busca
  return useMemo(() => new URLSearchParams(search), [search]);
};
