import  express  from "express";
import * as orderControllers from '../controllers//order.js'
import * as auth from '../controllers/auth.js'
const router=express.Router();
router.get("/",auth.adminAuth,orderControllers.getAllOrders);
router.get("/myOrders",auth.simpleAuth,orderControllers.getOrdersOfUser);
router.post("/",auth.simpleAuth,orderControllers.addNewOrder);
router.delete("/:id",auth.simpleAuth,orderControllers.deleteOrder);
router.put("/:id",auth.adminAuth,orderControllers.sendingOrder);
export default router;