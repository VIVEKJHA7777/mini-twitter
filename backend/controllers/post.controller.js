import User from "../models/user.model.js";
import Post from "../models/post.models.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

//.......create Post controller........................
export const createPost = async (req,res)=>{
    try{
       const { text } = req.body;
       let { img } =req.body;
       const userId= req.user._id.toString();

       const user = await User.findById(userId);
       if(!user) return res.status(404).json({ message:"user not found"});

       if(!text && !img){
        return res.status(400).json({ message:"Post must have text or image"});
       }

//.......upload image in cloundinary and getting secure url..........
       if(img){
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
       }

       const newPost = new Post({
         user:userId,
         text,
         img
       });

       await newPost.save();
       res.status(201).json(newPost);

    }
    catch(error){
       console.log("Error in createPost controller",error.message);
       res.status(500).json({error:error.message});
    }
}
//.......End of createPost controller.......................

//.........delete Post controller........................
export const deletePost = async (req,res)=>{
   try{
     const post = await Post.findById(req.params.id);
     if(!post){
        return res.status(404).json({error:"Post not found"});
     }
     if(post.user.toString()!==req.user._id.toString()){
        return res.status(401).json({error:"you are not authorized to delete this post"});
     }

     //....first delete the image from the cloudinary..........
     if(post.img){
        const imgId= Post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
     }

     await Post.findByIdAndDelete(req.params.id);
     res.status(200).json({message:"Post deleted successfully"});
   }
   catch(error){
       console.log("Error in deletePost controller",error.message);
       res.status(500).json({error:error.message});
   } 
}
//................End of delete Post controller..................

//.........commentOnPost controllers...............
export const commentOnPost = async (req,res)=>{
  try{
    const { text } = req.body;
    const postId= req.params.id;
    const userId = req.user._id;
    if(!text){
        return res.status(400).json({error:"Text field is required"});
    }
    
    const post= await Post.findById(postId);
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }

    const comment = {user:userId,text};

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  }
  catch(error){
     console.log("Error in commentOnPost controller",error.message);
     res.status(500).json({error:error.message});
  }
}
//.........End of commentOnPostController.............

//............likeUnlike post controllers......................
export const likeUnlikePost = async (req,res)=>{
   try{
     const userId= req.user._id;
     const {id:postId} = req.params;

    const post= await Post.findById(postId);
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }

    const userLikedPost = post.likes.includes(userId);

    if(userLikedPost){
        //Unlike post
     await Post.updateOne({_id:postId},{$pull:{likes:userId}});
     res.status(200).json({message:"Post unliked successfully"});
    }
    else{
      post.likes.push(userId);
      await post.save();

      const notification=new Notification(
        {
          from: userId,
          to:  post.user,
          type:"like",
        }
      );
      await notification.save();

      res.status(200).json({message:"Post Liked successfully"});
    }
   }
   catch(error){
     console.log("Error in likeUnlikePost controller",error.message);
     res.status(500).json({error:error.message});
   }
}
//.....End of likeUnlikePostController...............

//........getAllPosts controller......................
export const getAllPosts = async (req,res)=>{
  try{

    //...get all posts from post models but in post model we have only userId but i want username fullname that why i populate it.....
    const posts= await Post.find().sort({createdAt: -1}).populate({
        path:"user",
        select:"-password"
    })
    .populate({
        path:"comments.user",
        select:"-password",
    })

    if(posts.length==0){
       return res.status(200).json([]); 
    }

    res.status(200).json(posts);
  }
  catch(error){
    console.log("Error in getAllPosts controller",error.message);
     res.status(500).json({error:error.message});
  }
}
//.......end of getAllPosts controllers..................
