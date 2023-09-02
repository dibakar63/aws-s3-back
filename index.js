// const express=require("express");
// const multer=require("multer");
// //const cors=require("cors");
// const cors=require("cors");
// //const fileController=require('./controller')
// const connectDB=require("./db");
// //const bodyParser=require("body-parser");
// const upload=multer({dest:'uploads/'})
// const dotenv=require("dotenv").config()
// const app=express();
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use('/uploads', express.static('uploads'))
// connectDB()
// app.post('/api/files',upload.single('image',fileController.addFiles))
// app.post('/api/files',fileController.addFiles);

// app.listen(5000,()=>{
//     console.log("Server is running")
// })
// require("dotenv").config();
// const express=require("express");
// const app=express();
// const aws=require("aws-sdk");
// const multer=require("multer");
// const multerS3=require("multer-s3");


// aws.config.update({
//     secretAccessKey:process.env.SECRET_KEY,
//     accessKeyId:process.env.ACESS_KEY,
//     region:process.env.REGION,
//     bucket:process.env.BUCKET

// })
// const BUCKET=process.env.BUCKET;
// const s3=new aws.S3();
// const upload=multer({
//     storage:multerS3({
//         bucket:BUCKET,
//         s3:s3,
//         acl:"public-read",
//         key:(req,file,cb)=>{
//             cb(null,file.originalname);
//         }
//     })
// })
// app.post("/upload",upload.single("file"),(req,res)=>{
//     console.log(req.file);
//     res.send('Sucessfully uploaded' + req.file.location + 'location!')
// })
// app.get("/list",(req,res)=>{
//     s3.listObjectsV2({Bucket:BUCKET}).promise()
//     let x=r.Contents.map(item=>item.key);
//     res.send(x)
// })
// app.get("/download/:filename",async(req,res)=>{
//     const filename=req.params.filename
//    let x=await s3.getObject({Bucket:BUCKET,Key:filename}).promise();
//    res.send(x.Body);
// })
// app.delete("/delete/:filename",async(req,res)=>{
//     const filename=req.params.filename
//     await s3.deleteObject({Bucket:BUCKET,Key:filename}).promise();
//     res.send("File Deleted Successfully")
// })
// app.listen(3001);
const { S3Client,GetObjectCommand,PutObjectCommand,ListObjectsV2Command, DeleteObjectCommand }= require( "@aws-sdk/client-s3");
const { getSignedUrl } =require( "@aws-sdk/s3-request-presigner");
const express=require('express');

require('dotenv').config();
const app=express();

const s3Client=new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACESS_KEY,
        secretAccessKey:process.env.SECRET_KEY

    }
})

 async function getObjectURL(key){
    const command=new GetObjectCommand({
        Bucket:process.env.BUCKET,
        Key:key
    })
    const url=await getSignedUrl(s3Client,command);
    return url;
}
async function putObject(filename,contentType){
    const command=new PutObjectCommand({
        Bucket:process.env.BUCKET,
        Key:`uploads/user-uploads/${filename}`,
        ContentType:contentType
    })
    const url=await getSignedUrl(s3Client,command)
    return url
}
async function listObject(){
    const command=new ListObjectsV2Command({
        Bucket:process.env.BUCKET,
        key:"/"
    })
    const result=await s3Client.send(command)
    console.log(result)
}

async function init(){
   //  console.log("Url for file",await getObjectURL("uploads/user-uploads/file-1693623162441.pdf"))
   //console.log("Url", await putObject(`image-${Date.now()}.png`,"image/png")) 
   //console.log("Url", await putObject(`file-${Date.now()}.pdf`,"file/pdf")) 
  //await listObject()
  const cmd=new DeleteObjectCommand({
    Bucket:process.env.BUCKET,
     Key:"undefined/17623826-845a-4568-a12c-06c705fbf009"
   })
   await s3Client.send(cmd);
}  
init()
// app.listen(8080,()=>{
//     console.log("server is running");
// })

