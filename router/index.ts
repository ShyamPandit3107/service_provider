import Router from "express";
import { userLogin, userRegister } from "../controller/auth-controller";
import { createShop } from "../controller/shop-controller";
import { authMiddleware } from "../middleware/auth-middlware";
const router = Router();

//signin and signup routes

router.post("/login", userLogin);
router.post("/register", userRegister);

router.post("/shop", authMiddleware, createShop);
export default router;
