import  express  from "express";
import * as productControllers from '../controllers/product.js';
import * as auth from '../controllers/auth.js';
const router=express.Router();
router.get("/",productControllers.getAllProducts);
router.get("/category/:category",productControllers.getProductsInCategoty);
router.get("/count",productControllers.getcountOfProducts);
router.get("/count/category/:category",productControllers.getcountOfProducts);
router.get("/:id",productControllers.getProductById);
router.post("/",auth.adminAuth,productControllers.addNewProduct);
router.delete("/:id",auth.adminAuth,productControllers.deleteProductById);
router.put("/:id",auth.adminAuth,productControllers.updateProductById);
router.post("/uploadImage", auth.adminAuth, productControllers.uploadProductImage);
export default router;
