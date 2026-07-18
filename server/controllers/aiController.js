
import OpenAI from "openai";
import sql from "../config/db.js";
import { createClerkClient } from "@clerk/express";
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
import {v2 as cloudinary} from 'cloudinary';
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import pdf from 'pdf-parse/lib/pdf-parse.js'; 


const AI = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

export const generateArticle=async(req,res)=>{
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const {prompt,length}= req.body;
        const plan=req.plan;
        const free_usage=req.free_usage;
if(plan!=='premium'&& free_usage>=10){
            return res.status(403).json({success:false,message:'You have reached your free usage limit. Please upgrade to premium.'});
        }

   const response = await AI.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
        {
            role: "user",
            content: prompt,
        },

    ],
    temperature:0.7,
    max_tokens:length,
    
});

const content=response.choices[0].message.content;

await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},${prompt}, ${content}, 'article')`;
if(plan!=='premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
            free_usage:free_usage+1
        }
    })
}
res.json({success:true,content});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,message:error.message})
        
    }

}


export const generateblogtitle=async(req,res)=>{
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const {prompt}= req.body;
        const plan=req.plan;  
        const free_usage=req.free_usage;
if(plan!=='premium'&& free_usage>=10){
            return res.status(403).json({success:false,message:'You have reached your free usage limit. Please upgrade to premium.'});
        }

const response = await AI.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
        {
            role: "user",
            content: prompt,
        },

    ],
    temperature:0.7,
    max_tokens:100,
    
});

const content=response.choices[0].message.content;

await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},${prompt}, ${content}, 'blog-title')`;
if(plan!=='premium'){
    await clerkClient.users.updateUserMetadata(userId,{
        privateMetadata:{
            free_usage:free_usage+1
        }
    })
}
res.json({success:true,content});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,message:error.message})
        
    }

}

export const generateImage=async(req,res)=>{
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const {prompt,publish}= req.body;
        const plan=req.plan;
        
 if(plan!=='premium'){
            return res.status(403).json({success:false,message:'This feature is only available for premium subscribers'});
        }

const formData = new FormData()
formData.append('prompt', prompt)

const {data}= await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
    headers:{'x-api-key':process.env.CLIPDROP_API_KEY},
    responseType: 'arraybuffer'
})

const base64image=`data:image/png;base64,${Buffer.from(data,'binary').
    toString('base64')}`;                     //Converts the binary image to a base64 data URL.

    //cloudinary config
   const {secure_url}= await cloudinary.uploader.upload(base64image)
      

//You’re sending a prompt to an AI API, getting an image back, converting it into a 
// format that Cloudinary accepts, and then uploading it to get a public URL.


await sql `INSERT INTO creations (user_id, prompt, content, type,publish) VALUES (${userId},${prompt}, ${secure_url}, 'image',${publish ?? false})`;

res.json({success:true,content:secure_url});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,message:error.message})
        
    }

}

export const removeimagebackground=async(req,res)=>{
    
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
       
        const image = req.file;
        const plan=req.plan;
        
         if(plan!=='premium'){
            if (image && image.path) fs.unlinkSync(image.path);
        return res.status(403).json({success:false,message:
        'This feature is only available for premium subscribers'});
        }

   
      const{secure_url}=await cloudinary.uploader.upload(image.path,{
        transformation:[{
            resource_type:'image',
            effect:'background_removal'
            
        }]
      })
console.log(secure_url);
//placeholder variable is ${...}
await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},'Remove background from image', ${secure_url}, 'image')`;

if (image && image.path) fs.unlinkSync(image.path);
res.json({success:true,content:secure_url});

    } catch (error) {
        console.log(error.message);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
        res.status(500).json({success:false,message:error.message})
        
    }

}

export const removeimageobject=async(req,res)=>{
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
       const {object}=await req.body;
        const image= req.file;
        const plan=req.plan;
        
        if(plan!=='premium'){
            if (image && image.path) fs.unlinkSync(image.path);
        return res.status(403).json({success:false,message:
        'This feature is only available for premium subscribers'});
        }

   
   const {public_id}= await cloudinary.uploader.upload(image.path)

   const imageurl=cloudinary.url(public_id,{
    transformation:[{effect:`gen_remove:${object}`}],
    resource_type:'image'
   })




await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},${`Removed ${object} from image`}, ${imageurl}, 'image')`;

if (image && image.path) fs.unlinkSync(image.path);
res.json({success:true,content:imageurl});

    } catch (error) {
        console.log(error.message);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
        res.status(500).json({success:false,message:error.message})
        
    }

}

export const resumereview=async(req,res)=>{
    try {
        
        const {userId}=req.auth(); //Clerk confirms which user is making the request.
        const resume= req.file;
        const { jobDescription } = req.body;
        const plan=req.plan;
        
        if(plan!=='premium'){
            if (resume && resume.path) fs.unlinkSync(resume.path);
        return res.status(403).json({success:false,message:
        'This feature is only available for premium subscribers'});
        }

   
  if(resume.size>5*1024*1024){
    if (resume && resume.path) fs.unlinkSync(resume.path);
    return res.status(400).json({success:false,message:'Resume size exceeds 5MB limit. Please upload a smaller file.'});
  }
      
  const databuffer=fs.readFileSync(resume.path);
  const pdfData=await pdf (databuffer);

  const jdContext = jobDescription && jobDescription.trim() !== '' ? `\n\nTarget Job Description:\n${jobDescription}` : '';
  
  const prompt=`Analyze the following resume and provide a detailed ATS (Applicant Tracking System) evaluation. ${jdContext ? 'Also compare it against the Target Job Description provided below.' : ''}
Output strictly in JSON format using the following structure:
{
  "overallScore": <number between 0 and 100>,
  "strengthLevel": "<Excellent | Good | Average | Needs Improvement>",
  "sectionAnalysis": {
    "contact": {"score": <number>, "feedback": "<feedback>"},
    "summary": {"score": <number>, "feedback": "<feedback>"},
    "skills": {"score": <number>, "feedback": "<feedback>"},
    "experience": {"score": <number>, "feedback": "<feedback>"},
    "education": {"score": <number>, "feedback": "<feedback>"},
    "projects": {"score": <number>, "feedback": "<feedback>"}
  },
  "keywordMatchScore": <number between 0 and 100>,
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "matchingKeywords": ["<keyword1>", "<keyword2>"],
  "formattingCheck": {
    "score": <number between 0 and 100>,
    "feedback": "<feedback>"
  },
  "grammarReadabilityScore": <number between 0 and 100>,
  "technicalSkillsAnalysis": "<analysis>",
  "softSkillsAnalysis": "<analysis>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "recommendations": ["<rec1>", "<rec2>"]
}

Resume Content:
${pdfData.text}${jdContext}`;


 const response = await AI.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
        {
            role: "system",
            content: "You are an expert ATS resume reviewer. Always respond with strict, valid JSON matching the exact schema requested."
        },
        {
            role: "user",
            content: prompt,
        },

    ],
    response_format: { type: "json_object" },
    temperature:0.7,
    max_tokens:2000,
    
});

const content=response.choices[0].message.content;

await sql `INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},'Review the uploaded resume', ${content}, 'resume-review')`;

if (resume && resume.path) fs.unlinkSync(resume.path);
res.json({success:true,content});

    } catch (error) {
        console.log(error.message);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
        res.status(500).json({success:false,message:error.message})
        
    }
}

export const generateChat = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { messages } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.status(403).json({ success: false, message: 'You have reached your free usage limit. Please upgrade to premium.' });
        }

        const response = await AI.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are an AI assistant for IntelliSuite AI. Provide helpful, concise, and accurate responses." },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${messages[messages.length - 1].content}, ${content}, 'chat')`;
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const generateCode = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        
        if (plan !== 'premium' && free_usage >= 10) {
            return res.status(403).json({ success: false, message: 'You have reached your free usage limit. Please upgrade to premium.' });
        }

        const response = await AI.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are an expert software developer. Provide code solutions to the user's prompt. Always format your code in markdown code blocks." },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 2000,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'code')`;
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const summarizePdf = async (req, res) => {
    try {
        const { userId } = req.auth();
        const pdfFile = req.file;
        const plan = req.plan;
        const free_usage = req.free_usage;
        
        if (plan !== 'premium' && free_usage >= 10) {
            if (pdfFile && pdfFile.path) fs.unlinkSync(pdfFile.path);
            return res.status(403).json({ success: false, message: 'You have reached your free usage limit. Please upgrade to premium.' });
        }

        if (!pdfFile) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
        }

        if (pdfFile.size > 5 * 1024 * 1024) {
            if (pdfFile && pdfFile.path) fs.unlinkSync(pdfFile.path);
            return res.status(400).json({ success: false, message: 'PDF size exceeds 5MB limit.' });
        }

        const dataBuffer = fs.readFileSync(pdfFile.path);
        const pdfData = await pdf(dataBuffer);

        const prompt = `Please provide a comprehensive summary of the following document. Extract the key points, main arguments, and any critical conclusions. Format the response beautifully using Markdown with clear headings and bullet points.\n\nDocument Content:\n${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are an expert document analyzer. Provide clear, structured, and accurate summaries." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 2000,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Summarized a PDF document', ${content}, 'pdf-summary')`;
        
        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }
        
        if (pdfFile && pdfFile.path) fs.unlinkSync(pdfFile.path);
        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
}
