import React from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useRefreshToken = () => {
  const { setAuth }: any = useAuth();
  const refresh = async () => {
    const response = await axios.get("http://localhost:3000/user/refresh", {
      withCredentials: true,
    });
    setAuth((prev: any) => {
      console.log(JSON.stringify(prev));
      // console.log(response.data.accessToken);
      console.log(response.data.roles);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
