export type Origin =
  | string
  | RegExp
  | ((origin: string | undefined) => boolean);

export type CorsParams = {
  origins: Origin[] | "*";
  allowMethods?: string[] | "ALL";
  allowHeaders?: string[] | "ALL";
  allowCredentials?: boolean;
  allowPrivateNetwork?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;
  passthroughNonCorsRequests?: boolean;
};

export type NormalizedCorsParams = {
  origins: Origin[] | "*";
  allowMethods: { type: "all" } | { type: "specific"; methods: string };
  allowHeaders: string[] | "ALL";
  allowCredentials: boolean;
  allowPrivateNetwork: boolean;
  exposeHeaders: string;
  maxAge: number;
  passthroughNonCorsRequests: boolean;
};
