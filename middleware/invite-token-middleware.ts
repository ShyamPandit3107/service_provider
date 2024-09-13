import { NextFunction, Response } from "express";
import { InviteTokenRequest } from "../constant";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const validateInviteToken = async (
  req: InviteTokenRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.inviteToken;
    const inviteToken = await prisma.inviteToken.findUnique({
      where: { token },
    });
    if (!inviteToken) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = {
      role: inviteToken.role as "MANEGER" | "EMPLOYEE" | "OWNER",
      shopId: inviteToken.shopId,
    };
    return next();
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
