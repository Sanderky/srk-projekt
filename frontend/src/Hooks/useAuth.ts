import { useContext } from "react";
import AuthContext from "../Context/AuthenticationProvider";
const useAuth = () => {
  return useContext(AuthContext);
};
export default useAuth;
