import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../Hooks/useResfreshToken";
import useAuth from "../Hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth }: any = useAuth();

  useEffect(() => {
    const veryfiyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        console.log("isFinally")
      }
    };

    !auth?.accessToken ? veryfiyRefreshToken() : setIsLoading(false);
  }, []);

  return (
    <>
        {isLoading? <p>Loading..</p>
        : <Outlet/>}
    </>
  )
};

export default PersistLogin;