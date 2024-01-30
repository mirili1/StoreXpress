import mongoose from "mongoose"
export const addressSchema=mongoose.Schema({
    city:{type: String, required: true },
    street:{type: String, required: true },
    houseNumber:{type: Number, required: true },   
})