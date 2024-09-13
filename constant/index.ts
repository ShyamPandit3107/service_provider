import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string } | JwtPayload;
}

export interface InviteTokenRequest extends Request {
  user?: { role: "MANEGER" | "EMPLOYEE" | "OWNER"; shopId: string };
}
