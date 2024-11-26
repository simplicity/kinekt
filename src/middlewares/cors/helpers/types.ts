export type Origin = string | RegExp;

export type CorsParams = {
  origins: Origin[] | "*";
  allowMethods?: string[] | "ALL";
  allowHeaders?: string[] | "ALL";
  allowCredentials?: boolean;
  allowPrivateNetwork?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;
};

export type NormalizedCorsParams = {
  origins: Origin[] | "*";
  allowMethods: { type: "all" } | { type: "specific"; methods: string };
  allowHeaders: { type: "all" } | { type: "specific"; headers: string };
  allowCredentials: boolean;
  allowPrivateNetwork: boolean;
  exposeHeaders: string;
  maxAge: number;
};
