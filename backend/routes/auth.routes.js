import express from 'express';
import { signup, login, logout } from '../controllers/auth.controllers';
const router= express.Router();


//.........authentication routes...............

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

export default router;