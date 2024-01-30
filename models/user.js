import joi from "joi";
import mongoose from "mongoose";
const userSchema = mongoose.Schema(
    {
    name: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    registrationDate:{ type: Date, default: Date.now()},
    role:{type:String,default:"USER"}
    },
    // ,{ timestamps: true }
    )
export const User = mongoose.model("users", userSchema);

export const userValidator = (_userToValidate) => {
    let userJoi = joi.object({
        name: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().email().required(),
        registrationDate: joi.date().default(Date.now()),
        role:joi.string().default("USER")
    })
    return userJoi.validate(_userToValidate)
}
export const loginValidator = (_detailsToValidate) => {
    let userJoi = joi.object({
        password: joi.string().required(),
        email: joi.string().email().required()
    })
    return userJoi.validate(_detailsToValidate)
}