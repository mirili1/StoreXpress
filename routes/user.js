import  express  from "express";
import * as userControllers from '../controllers/user.js'
import * as auth from '../controllers/auth.js'
const router=express.Router();
router.get("/",auth.adminAuth,userControllers.getAllUsers);
router.post("/",userControllers.addNewUser);
router.post("/login",userControllers.login);
export default router;