import { Request } from "express";
import { AuthenticatedRequest } from "../constant";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTask  = async (req:AuthenticatedRequest,res:Request)=>{
    const {title,description} = req.body;
    const shopId = req.user?.shopId;
    const task = prisma.task.create({
        data:{
            title,
            description,
            shopId
        }
    })
}