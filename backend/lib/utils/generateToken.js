import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (userId,res)=>{
    //taking userId as payload
   const token= jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'15d'
   })

   //set cookie in res name as jwt.......
   res.cookie("jwt",token,{
    maxAge:15*24*60*60*1000, //in ms
    httpOnly:true,  //prevent Xss attacks cross-site scripting attacks
    sameSite:"strict", //CSRF attacks cross-site request
    secure: process.env.NODE_ENV!=="development",
   })
}