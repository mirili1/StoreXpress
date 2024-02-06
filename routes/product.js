import  express  from "express";
import * as productControllers from '../controllers/product.js';
import * as auth from '../controllers/auth.js';
const router=express.Router();
router.get("/",productControllers.getAllProducts);
router.get("/:id",productControllers.getProductById);
router.post("/",auth.adminAuth,productControllers.addNewProduct);
router.delete("/:id",auth.adminAuth,productControllers.deleteProductById);
router.put("/:id",auth.adminAuth,productControllers.updateProductById);
export default router;