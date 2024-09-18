import Router from "express";
import {
  registerWithInvite,
  userLogin,
  userRegister,
} from "../controller/auth-controller";
import {
  createInvitation,
  createShop,
  deleteShop,
  getAllShops,
  updateShop,
} from "../controller/shop-controller";
import { authMiddleware } from "../middleware/auth-middlware";
import { validateInviteToken } from "../middleware/invite-token-middleware";
import { verifyRole } from "../middleware/task-middlware";
import { createTask } from "../controller/task-controller";
const router = Router();

//signin and signup routes

router.post("/login", userLogin);

router.post("/register", userRegister);
router.post("/register/:inviteToken", validateInviteToken, registerWithInvite);

//shop
router.post("/shop", authMiddleware, createShop);
router.get("/shops", authMiddleware, getAllShops);
router.post("/shop/:shopId/invite", authMiddleware, createInvitation);
router.delete("/shop/:shopId", deleteShop);
router.put("/shop/:shopId", updateShop);

//task
router.post("/shop/:shopId/tasks", authMiddleware, verifyRole, createTask);

export default router;
