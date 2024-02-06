import joi from "joi";
import mongoose from "mongoose";
const theProductDetails=mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  model:{ type: String, required: true },
  price:{ type: Number, required: true },
  imgUrl: { type: String, required:true },
  quantity:{type:Number,default:1},
},
{ timestamps: true })
const shoppingCartSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    product: { type: theProductDetails, required: true }
});
export const ShoppingCart=mongoose.model("shopping cart",shoppingCartSchema) ;

export const shoppingCartValidator = (_itemToValidate) => {
    let shoppingCartJoi = joi.object({
        owner: joi.string().hex().length(24).required(),
        product:joi.object({
                _id: joi.string().hex().length(24).required(),
                model:joi.string().required(),
                price:joi.number().required(),
                imgUrl:joi.string().required(),
                quantity: joi.number().default(1)
            }
        ).required(),
    });         
    return shoppingCartJoi.validate(_itemToValidate);
};
