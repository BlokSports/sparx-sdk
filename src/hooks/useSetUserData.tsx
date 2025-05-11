import { useCallback, useEffect } from "react";
import { setUserRequest } from "../service";

interface IUserData {
  userName: string;
  avatar: string;
  _id: string;
}

export function useSetUserData(userData: IUserData) {
  const setUserData = useCallback(async () => {
    try {
      const { data } = await setUserRequest(userData);

      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [userData]);

  useEffect(() => {
    setUserData();
  }, [setUserData]);
}
