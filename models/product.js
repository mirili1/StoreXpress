import joi from "joi";
import mongoose from "mongoose";
const productSchema = mongoose.Schema(
    {
        category:{ type: String, required: true },
        model:{ type: String, required: true },
        manufacturer:{ type: String, required: true },
        price:{ type: Number, required: true },
        description:{ type: String, required: true },
        size:{ type: String, required: true },
        color:{ type: String, required: true },
        warrantyConditions:{ type: String, required: true },
        imgUrl: { type: String, default: "https://shopcore.onrender.com/מצלמה.jpg" },
        introducer:{type: mongoose.Schema.Types.ObjectId,required: true }
    })
export const Product = mongoose.model("products", productSchema);

export const productValidator = (_productToValidate) => {
    let productJoi = joi.object({
        category: joi.string().required(),
        model:joi.string().required(),
        manufacturer:joi.string().required(),
        price:joi.number().min(1).required(),
        description:joi.string().required(),
        size:joi.string().required(),
        color:joi.string().required(),
        warrantyConditions:joi.string().required(),
        imgUrl: joi.string().default('https://shopcore.onrender.com/מצלמה.jpg').replace(/^/, 'https://shopcore.onrender.com/'),
        introducer:joi.string().hex().length(24).required()
    })
    return productJoi.validate(_productToValidate)
}
