import express from "express";
import controller from "@/controllers/User";
import cookieParser from "cookie-parser"

const router = express.Router();
router.use(cookieParser())
router.post('/signup', controller.createUser);
router.post('/login', controller.loginUser);

export = router;
