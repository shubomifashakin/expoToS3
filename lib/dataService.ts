import { s3Client } from "./s3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

//polyfill for uuid errros in react native
import "react-native-get-random-values";

//polyfill for buffer
import "./bufferPolyfill";

//this is the function
//it receives the base64 string of the file we want to upload and the fileType
export async function uploadToS3({
  base64String,
  fileType,
}: {
  base64String: string;
  fileType: string;
}) {
  //the name of the bucket you created
  const bucketName = process.env.EXPO_PUBLIC_S3_BUCKET as string;
  const region = process.env.EXPO_PUBLIC_S3_REGION as string;

  // Decode the Base64 string to binary data
  const byteArray = Buffer.from(base64String, "base64");

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${Date.now()}-image`,
    Body: byteArray,
    ContentType: fileType,
  });

  try {
    //send the image to our s3
    await s3Client.send(command);

    //if the file upload was successful, this is the link to that image
    const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${command.input.Key}`;
    console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.log(error);
    console.log("Could not upload the file to s3");
  }
}
