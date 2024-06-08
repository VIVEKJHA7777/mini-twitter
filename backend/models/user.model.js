import mongoose from "mongoose";

//.................defining schema............................
const userSchema= new mongoose.Schema({
  username: {
    type:String,
    required:true,
    unique:true
  },
  fullName: {
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  followers:[
     {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
     }
  ],
  following:[
     {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
     }
  ],
  profileImg:{
    type:String,
    default:"",
  },
  coverImg:{
    type:String,
    default:"",
  },
  bio:{
   type:String,
   default:"",
  },
  link:{
    type:String,
    default:"",
  }
},{timestamps:true});


//create a collection name as User..........
const User= mongoose.model("User",userSchema);

export default User;