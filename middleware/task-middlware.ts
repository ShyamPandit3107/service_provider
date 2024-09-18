import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../constant";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const verifyRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No user provided" });
    }
    const shopId = await prisma.shop.findFirst({
      where: {
        OR: [{ ownerId: req.user.id }, { manager: { userId: req.user.id } }],
      },
      include: {
        owner: true,
        manager: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!shopId) {
      return res.status(401).json({ error: "no shop found" });
    }
    req.user.shopId = shopId;
    return req.user.role === "EMPLOYEE"
      ? res
          .status(401)
          .json({ error: "Employee cannot register OWNER or MANAGER" })
      : next();
  } catch (error) {
    res.json({ error });
  }
};
