import { ResponseDto, UsersDto } from "@/Api/ApiDto";
import { post } from "./client";

export type LoginPayload = {
  username: string;
  password: string;
};

export function authenticate(payload: LoginPayload) {
  return post<ResponseDto<UsersDto>>("/users/authenticate", payload);
}

export function refreshToken(refreshToken: string) {
  return post<ResponseDto<UsersDto>>("/users/refreshToken", { refreshToken });
}
