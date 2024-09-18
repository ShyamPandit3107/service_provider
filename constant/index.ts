import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?:
    | {
        id: string;
        email: string;
        role: "MANAGER" | "EMPLOYEE" | "OWNER";
        shopId?: string;
      }
    | JwtPayload;
}

export interface InviteTokenRequest extends Request {
  shop?: { role: "MANAGER" | "EMPLOYEE" | "OWNER"; shopId: string };
}
