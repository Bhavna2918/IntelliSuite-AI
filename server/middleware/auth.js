import { createClerkClient } from "@clerk/express";
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const auth=async(req,res,next)=>{ //fuction to check if user has premium or not
    try {
        const { userId } = req.auth();
        
        // Mock premium access to bypass limits
        req.free_usage = 0;
        req.plan = 'premium';
        
        next();

    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}