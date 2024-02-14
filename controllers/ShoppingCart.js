import mongoose from 'mongoose';
import { ShoppingCart,shoppingCartValidator } from '../models/ShoppingCart.js';
export const getAllShoppingCart = async (req, res) => {
    try {
        let owner = req.user._id;
        let userShoppingCart = await ShoppingCart.find({owner});
        res.json(userShoppingCart);
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const addNewItemToShoppingCart = async (req, res) => {
    try {
        let owner = req.user._id;
        let validate = shoppingCartValidator({ ...req.body, owner })
        if (validate.error) {
            let errorMessages = [];
            validate.error.details.forEach((errorDetail) => {
                const { message, path } = errorDetail;
                const errorMessage = `${path.join('.')} ${message}`;
                errorMessages.push(errorMessage);
            });
            return res.status(400).send(errorMessages);
        };
        let newItem = await ShoppingCart.create(validate.value);
        res.json(newItem)
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const deleteItemFromShoppingCart = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("id ins`t valid");
        let item = await ShoppingCart.findById(id);
        if (!item)
            return res.status(404).send("there are no such an item")
        let deletedItem = await ShoppingCart.findByIdAndDelete(id);
        res.json(deletedItem)
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const updateItemInShoppingCart = async (req, res) => {
    try {
        let { id } = req.params;
        let { count } = req.body;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("id ins`t valid");
        let item = await ShoppingCart.find({product:{_id:id}});
        if (!item)
            return res.status(404).send("there are no such an item");
        if(req.user._id!=item.owner)
            return res.status(403).send("you are not authorized");
        item.product.quantity = count;
        await item.save();
        res.status(200).send("count was changed")
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}