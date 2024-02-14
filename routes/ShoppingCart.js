import  express  from "express";
import * as shoppingCartControllers from '../controllers/ShoppingCart.js';
import * as auth from '../controllers/auth.js';
const router=express.Router();
router.get("/",auth.simpleAuth,shoppingCartControllers.getAllShoppingCart);
router.post("/",auth.simpleAuth,shoppingCartControllers.addNewItemToShoppingCart);
router.delete("/:id",auth.simpleAuth,shoppingCartControllers.deleteItemFromShoppingCart);
router.put("/:id",auth.simpleAuth,shoppingCartControllers.updateItemInShoppingCart);
export default router;