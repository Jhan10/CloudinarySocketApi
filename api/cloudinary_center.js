import { v2 as cloudinary } from 'cloudinary';
import { convertToMime } from '../utils/convert_mime.js';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configure your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
//console.log(getCloudinarySignature());
console.log('MIME');
console.log(convertToMime("path/to/your/file.jpg"));

//passingDataToFrontend();
// 2. Create a function to generate the signature
export function getCloudinarySetData() {
  const timestamp = Math.round(new Date().getTime() / 1000); // Current Unix timestamp
  
  // Define parameters you intend to send to Cloudinary (e.g., upload folder)
  const paramsToSign = {
    timestamp: timestamp,
    folder: process.env.CLOUDINARY_FOLDER
  };

  // 3. Generate the signature code
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign, 
    cloudinary.config().api_secret
  );
  console.log(`Generated signature: ${signature} at timestamp: ${timestamp}`);

  // Return these 3 exact values to your frontend
  process.env.Signature = signature;
  process.env.Timestamp = timestamp;

  return {
    signature: signature ? signature : process.env.Signature,
    timestamp: timestamp ? timestamp : process.env.Timestamp,
    apiKey: cloudinary.config().api_key ? cloudinary.config().api_key : process.env.CLOUDINARY_API_KEY,
    cloud_name: cloudinary.config().cloud_name ? cloudinary.config().cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: cloudinary.config().api_secret ? cloudinary.config().api_secret : process.env.CLOUDINARY_API_SECRET,
    folder: cloudinary.config().folder ? cloudinary.config().folder : process.env.CLOUDINARY_FOLDER,
    server_file_path: process.env.SERVER_FILE_PATH
  };
}

export async function passingDataToFrontend(serverFileName) {
  console.log('tentando salvar no cloudinary...');
  // Example Frontend Upload payload
const { signature, timestamp, apiKey, cloud_name, api_secret, folder,server_file_path } = getCloudinarySetData();

let entireFilePath = `${process.cwd()}\\${server_file_path}\\${serverFileName}`;
entireFilePath = entireFilePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes for URL compatibility
const base64DataUri = imagePathToBase64(entireFilePath);

console.log(`Entire file path: ${ entireFilePath }`);
const formData = new FormData();
formData.append("file", base64DataUri);
formData.append("api_key", apiKey);
formData.append("timestamp", timestamp);
formData.append("signature", signature);
formData.append("folder", folder);
const URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload/`;
console.log(`Sending data to Cloudinary: ${URL}`);
//console.log(formData);
 const response = await fetch(URL, {
  method: "POST",
  body: formData
})

//.then(data => console.log("Upload successful!", data));

// 3. Converter a resposta para JSON
    const dados = await response.json();

    // 4. Capturar o Public ID 🌟
    const publicId = dados.public_id;
    console.log("O Public ID da imagem é:", publicId);
}

export function imagePathToBase64(filePath) {
  try {
    // Read the file into a binary buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Convert the buffer directly to a base64 string
    const base64String = fileBuffer.toString('base64');
    
    // Optional: Determine the extension to create a data URI
    const extension = filePath.split('.').pop();
    
    return `data:image/${extension};base64,${base64String}`;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}