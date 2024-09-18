import { Response } from "express";
import { AuthenticatedRequest, InviteTokenRequest } from "../constant";
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
    const shop = await prisma.shop.create({
      data: {
        name,
        address,
        phone,
        description,
        ownerId: req.user.id,
      },
    });
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ error: "Failed to create shop" });
  }
};
export const getAllShops = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shops = await prisma.shop.findMany();
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
};
export const createInvitation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Invalid user" });
  }
  const shopId = req.params.shopId;
  const role = (req.query.role as "MANAGER" | "EMPLOYEE") || "EMPLOYEE";
  try {
    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });
    if (!shop) {
      throw new Error("Shop not found");
    }
    if (shop.managerId && role === "MANAGER") {
      return res.status(400).json({ error: "Shop already has a manager" });
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
export const updateShop = async (req: AuthenticatedRequest, res: Response) => {
  const shopId = req.params.shopId;
  const { name, address, phone, description } = req.body;

  try {
    // Check if the shop exists
    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Update shop
    const updatedShop = await prisma.shop.update({
      where: {
        id: shopId,
      },
      data: {
        name,
        address,
        phone,
        description,
      },
    });

    res.json({ updatedShop });
  } catch (error) {
    res.status(500).json({ error: "Failed to update shop" });
  }
};
export const deleteShop = async (req: AuthenticatedRequest, res: Response) => {
  const shopId = req.params.shopId;

  try {
    // Check if the shop exists
    const shop = await prisma.shop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Delete the shop
    await prisma.shop.delete({
      where: {
        id: shopId,
      },
    });

    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete shop" });
  }
};
