export type JwtPayload = {
  userId: number;
  email: string;
  sub: "access_token" | "refresh_token";
};
