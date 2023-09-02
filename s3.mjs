import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
    DeleteObjectCommand
  } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import { v4 as uuid } from "uuid";
  
  const s3 = new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACESS_KEY,
        secretAccessKey:process.env.SECRET_KEY

    }
});
  const BUCKET = process.env.BUCKET;
  
  export const uploadToS3 = async ({ file, userId }) => {
    const key = `${userId}/${uuid()}`;
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
  
    try {
      await s3.send(command);
      return { key };
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
  
  const getImageKeysByUser = async (userId) => {
    const command = new ListObjectsV2Command({
      Bucket: process.env.BUCKET,
      Prefix: userId,
    });
  
    const { Contents = [] } = await s3.send(command);
  
    return Contents.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    ).map((image) => image.Key);
  };
  
  export const getUserPresignedUrls = async (userId) => {
    try {
      const imageKeys = await getImageKeysByUser(userId);
  
      const presignedUrls = await Promise.all(
        imageKeys.map((key) => {
          const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
          return getSignedUrl(s3, command, { expiresIn: 900 }); // default
        })
      );
      return { presignedUrls };
    } catch (error) {
      console.log(error);
      return { error };
    }
  };
  async function init(){
    const cmd=new DeleteObjectCommand({
      Bucket:process.env.BUCKET,
       Key:"undefined/f0978d0d-0c2a-43d0-ae60-4f2a8ea62afd"
     })
     await s3.send(cmd);
  }
  init()
  