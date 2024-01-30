import mongoose from 'mongoose';
import { User,userValidator,loginValidator } from '../models/user.js';
import {generateToken} from '../config/generateTocken.js'
import bcyript from 'bcryptjs'
export const addNewUser=async(req,res)=>{
    try{
    let {name,password,email}=req.body;
    if(!(/[a-zA-Z]/.test(password) && /\d/.test(password)))
       return res.status(400).send("Password must contain at least one letter and one number");
    password= await bcyript.hash(password,15);
    let validate = userValidator({name,password,email});
    // if (validate.error) {
    //     validate.error.details.forEach((err) => {
    //         console.log(err.message);
    //       })
    //     return res.status(400).send(validate.error.details);
    //  }
    if (validate.error) {
        let errorMessages = [];
        validate.error.details.forEach((errorDetail) => {
          const { message, path } = errorDetail;
          const errorMessage = `${path.join('.')} ${message}`;
          errorMessages.push(errorMessage);
        });
        return res.status(400).send(errorMessages);
      }
    let sameUser= await User.find({name,email});
    if (sameUser.length > 0) 
        return  res.status(409).send("this user already exists ");
    let newUser=await User.create(validate.value);
    let token=generateToken(newUser);
    let {_id,registrationDate,role}=newUser;
    res.json({_id,name,email,role,registrationDate,token})
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const login=async(req,res)=>{
    try{
        let {password,email}=req.body;
        let validate=loginValidator({password,email});
        // if (validate.error) {
        //     validate.error.details.forEach((err) => {
        //         console.log(err.message);
        //       })
        //     return res.status(400).send(validate.error.details);
        //  }
        if (validate.error) {
            let errorMessages = [];
            validate.error.details.forEach((errorDetail) => {
              const { message, path } = errorDetail;
              const errorMessage = `${path.join('.')} ${message}`;
              errorMessages.push(errorMessage);
            });
            return res.status(400).send(errorMessages);
          }
        let user=await User.findOne({email})
        if(!user)
            return res.status(404).send("no such user");
        if (!await bcyript.compare(password, user.password)) 
            return res.status(401).send("did you forget your password?");
        let {_id,name,role,registrationDate}=user;
        let token=generateToken(user);
        res.json({_id,name,email,role,registrationDate,token});
    }
    catch(err){
        res.status(400).send("problem " + err.message);
    }
}
export const getAllUsers=async(req,res)=>{
    try{
        let allUsers=await User.find();
        res.json(allUsers);
    }
    catch(err){
        res.status(400).send("problem " + err.message);
    }
}
