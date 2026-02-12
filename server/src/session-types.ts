import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      password: string; // (don’t store passwords in real apps)
    };
  }
}

export {};