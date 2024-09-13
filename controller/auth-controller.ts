import { InviteToken, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthenticatedRequest, InviteTokenRequest } from "../constant";

const prisma = new PrismaClient();

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );

    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};
export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const api_key = jwt.sign({ email }, process.env.JWT_SECRET!);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: password_hash,
        role,
      },
    });
    if (user) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      console.log("some error occured");
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occurred" });
    }
  }
};

export const registerWithInvite = async (
  req: InviteTokenRequest,
  res: Response
) => {
  try {
    const { email, password, name } = req.body;
    const inviteToken = req.body.inviteToken;
    const { role, shopId } = req.user || {};
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (role == "MANEGER") {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "MANAGER",
          manager: {
            create: {
              shops: {
                connect: { id: shopId }, // Assign manager to the shop
              },
            },
          },
        },
      });
    } else {
      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "EMPLOYEE",
          employee: {
            create: {
              tasks: {
                create: [], // New employee starts with no tasks
              },
            },
          },
        },
      });
    }
    await prisma.inviteToken.delete({ where: { token: inviteToken } });
    return res.status(201).json({ newUser });
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error occured\n" + error });
  }
};
