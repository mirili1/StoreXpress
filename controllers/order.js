import mongoose from 'mongoose';
import { Order,orderValidator } from '../models/order.js';
export const getAllOrders=async(req,res)=>{
    try{
        let allOrders=await Order.find();
        res.json(allOrders);
    }
    catch(err){
        res.status(400).send("problem " + err.message);
    }
}
export const getOrdersOfUser=async(req,res)=>{
    try{
        let {_id}=req.user;
        let userOrders=await Order.find({owner:_id});
        res.json(userOrders);
  }
  catch(err){
    res.status(400).send("problem " + err.message);
}
}
export const addNewOrder=async(req,res)=>{
  try{
        let owner=req.user._id;
        let validate=orderValidator({...req.body,owner})
        // if (validate.error) {
        //     validate.error.details.forEach((err) => {
        //         console.log(err.message);
        //       })
        //     return res.status(400).send(validate.error.details);
        // };
        if (validate.error) {
            let errorMessages = [];
            validate.error.details.forEach((errorDetail) => {
              const { message, path } = errorDetail;
              const errorMessage = `${path.join('.')} ${message}`;
              errorMessages.push(errorMessage);
            });
            return res.status(400).send(errorMessages);
          };
        let newOrder=await Order.create(validate.value);
        res.json(newOrder)
  }
  catch(err){
    res.status(400).send("problem " + err.message);
}
}
export const deleteOrder=async(req,res)=>{
    try{
        let {id}=req.params;
        if (!mongoose.isValidObjectId(id))
          return res.status(400).send("id ins`t valid");
        let order=await Order.findById(id);
        if(!order)
            return res.status(404).send("there are no such an order")
        if(order.isSent)
            return res.status(400).send("the order was sent already");
        if(!req.user.role=="ADMIN"&&!req.user._id==order.owner)
            return res.status(403).send("you are not authorized");
        let deletedOrder=await Order.findByIdAndDelete(id);
        res.json(deletedOrder)
  }
  catch(err){
    res.status(400).send("problem " + err.message);
}
}

export const sendingOrder=async(req,res)=>{
    try{
        let {id}=req.params;
        if (!mongoose.isValidObjectId(id))
        return res.status(400).send("id ins`t valid");
        let order=await Order.findById(id);
        if(!order)
            return res.status(404).send("there are no such an order")
        if(order.isSent)
            return res.status(200).send("the order was sent already");
        order.isSent=true;
        await order.save();
        res.status(200).send("sent successfully")    
  }
  catch(err){
    res.status(400).send("problem " + err.message);
}
}
