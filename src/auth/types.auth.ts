export interface IPayloadUser {
  id: number;
  fullname: string;
  role: number;
}

export interface IPayloadRefreshToken {
  id: number;
  fullname: string;
  role: number;
  token: string;
}
