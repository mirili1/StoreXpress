import joi from "joi";
import mongoose from "mongoose";
import {addressSchema} from './address.js'
const theProductDetails=mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  model:{ type: String, required: true },
  price:{ type: Number, required: true },
  description:{ type: String, required: true },
  quantity:{type:Number,default:1}
})
const orderSchema = mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    address: { type: addressSchema, required: true },
    products: { type: [theProductDetails], required: true },
    isSent:{type:Boolean,default:false}
});
export const Order=mongoose.model("orders",orderSchema) ;

export const ordertValidator = (_orderToValidate) => {
    let orderJoi = joi.object({
        orderDate: joi.date().default(Date.now),
        dueDate: joi.date().required(),
        owner: joi.string().hex().length(24).required(),
        address: joi.object({
            city: joi.string().required(),
            street: joi.string().required(),
            houseNumber: joi.number().required()
        }).required(),
        products: joi.array().items(
            joi.object({
                _id: joi.string().hex().length(24).required(),
                model:joi.string().required(),
                price:joi.number().required(),
                description:joi.string().required(),
                quantity: joi.number().default(1)
            })
        ).required(),
        isSent:joi.boolean().default(false)
    });
    return orderJoi.validate(_orderToValidate);
};
