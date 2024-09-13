import { Response } from "express";
import { AuthenticatedRequest } from "../constant";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { randomBytes } from "crypto";
const prisma = new PrismaClient();
export const createShop = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, address, phone, description } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await prisma.shop.create({
      data: {
        name,
        address,
        phone,
        description,
        ownerId: req.user.id,
      },
    });
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: "Failed to create shop" });
  }
};
export const createInvitation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const shopId = req.query.shopId as string;
  const role = req.query.role as "MANAGER" | "EMPLOYEE";
  try {
    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });
    if (!shop) {
      throw new Error("Shop not found");
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = dayjs().add(7, "days").toDate();
    const inviteToken = await prisma.inviteToken.create({
      data: {
        token,
        shopId,
        role,
        expiresAt,
      },
    });
    res.json({ inviteToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to create invitation" });
  }
};
