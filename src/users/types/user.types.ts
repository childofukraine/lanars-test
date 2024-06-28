export interface AccessTokenInRequest extends Request {
  user: {
    id: string;
  };
}
