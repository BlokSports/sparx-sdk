import axios from "axios";
import { IMessage, IUserData, IAnswerData } from "./types";
import { IPollsData } from "../types";

const localInstance = axios.create({
  baseURL: "https://chat.sparx.studio",
});

export const setUserRequest = (userData: IUserData) => {
  const res = localInstance.post<IUserData, { data: IUserData }>(
    "/user",
    userData
  );

  return res;
};

export const getRoomRequest = (roomId: string) => {
  const res = localInstance.get<IMessage[]>(`/chat/${roomId}`);

  return res;
};

export const setUserAnswer = (answerData: IAnswerData) => {
  const res = localInstance.put("/user", answerData);

  return res;
};

export const getPollsRequest = (episodeId: string) => {
  const res = localInstance.get<IPollsData>(`/polls/${episodeId}`);

  return res;
};
