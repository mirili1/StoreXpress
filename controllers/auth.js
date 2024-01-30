import jwt from 'jsonwebtoken';
export const simpleAuth=(req,res,next)=>{
    let token=req.headers["x-access-token"];
    if(!token)
        return res.status(403).send("sign in again");
    try{
        req.user=jwt.verify(token,process.env.JWT_SECURING);
        next();
    }
    catch{
       return res.status(401).send("this token isn't authorized"); 
    }
};
export const adminAuth=(req,res,next)=>{
    let token=req.headers["x-access-token"];
    if(!token)
    return res.status(403).send("sign in again");
    try{
        let user=jwt.verify(token,process.env.JWT_SECURING);
        if(user.role=="ADMIN"){
            req.user=user;
            next();
          }
          else{
              return res.status(403).send("You are not authorized");
          }
    }
    catch{
       return res.status(401).send("this token isn't authorized"); 
    }
};