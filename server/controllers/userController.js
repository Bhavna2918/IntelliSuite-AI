
import sql from "../config/db.js";
//Show logged-in user's creations
//This endpoint lets a logged-in user view their own creations.
export const getusercreations=async(req,res)=>{
    try {
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const creations=await sql `SELECT * FROM creations WHERE user_id=${userId} 
         ORDER BY created_at DESC`;

        res.json({success:true,creations});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}



export const getpublishedcreations=async(req,res)=>{
    try {
        
const creations=await sql `SELECT * FROM creations WHERE publish = true
ORDER BY created_at DESC`;

        res.json({success:true,creations});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
        
    }
}

export const togglelikecreations=async(req,res)=>{
    try {
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const {id}=req.body;   //creation id
        const [creation]=await sql `SELECT * FROM creations WHERE id=${id}`;
        if(!creation){
            return res.status(404).json({success:false,message:'Creation not found'});
        }
const currentlike=creation.likes;  //creation.likes is a list of user IDs who have liked this post.
const userIdstr=userId.toString();

let updatedlikes;
let message;

if(currentlike.includes(userIdstr)){

updatedlikes=currentlike.filter((user)=>user!==userIdstr);
message='creation unliked';
}
else{
updatedlikes=[...currentlike,userIdstr];
message='creation liked';
}

const formatedArray=`{${updatedlikes.join(',')}}`;
    
        
await sql `UPDATE creations SET likes=${formatedArray}:: text[] WHERE id=${id}`;

        res.json({success:true,message});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
        
    }
}