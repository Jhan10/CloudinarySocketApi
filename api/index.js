const cloudinary = require('cloudinary').v2;
const { convertToMime } = require('../utils/convert_mime');

// 1. Configure your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
console.log(getCloudinarySignature());
passingDataToFrontend();
// 2. Create a function to generate the signature
function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000); // Current Unix timestamp
  
  // Define parameters you intend to send to Cloudinary (e.g., upload folder)
  const paramsToSign = {
    timestamp: timestamp,
    folder: 'user_uploads' 
  };

  // 3. Generate the signature code
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign, 
    cloudinary.config().api_secret
  );

  // Return these 3 exact values to your frontend
  process.env.Signature = signature;
  process.env.Timestamp = timestamp;

  return {
    signature,
    timestamp,
    apiKey: cloudinary.config().api_key ? cloudinary.config().api_key : process.env.CLOUDINARY_API_KEY
  };
}

function passingDataToFrontend() {
    // Example Frontend Upload payload
const formData = new FormData();
formData.append("file", convertToMime("path/to/your/file.jpg"));
formData.append("api_key", process.env.CLOUDINARY_API_KEY);
formData.append("timestamp", process.env.Timestamp);
formData.append("signature", process.env.Signature);
formData.append("folder", process.env.CLOUDINARY_FOLDER);

fetch("https://cloudinary.com", {
  method: "POST",
  body: formData
})
.then(response => response.json())
.then(data => console.log("Upload successful!", data));
}
