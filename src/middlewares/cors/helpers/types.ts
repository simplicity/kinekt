export type Origin =
  | string
  | RegExp
  | ((origin: string | undefined) => boolean);

export type CorsOptions = {
  origins: Origin[] | "*";
  allowMethods?: string[] | "ALL";
  allowHeaders?: string[] | "ALL";
  allowCredentials?: boolean;
  allowPrivateNetwork?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;
  passthroughNonCorsRequests?: boolean;
};
