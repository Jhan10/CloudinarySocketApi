import express from 'express';
import axios from 'axios';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { getCloudinarySetData, passingDataToFrontend } from './cloudinary_center.js';

import dotenv from 'dotenv';
import { json } from 'stream/consumers';
dotenv.config();

const app = express();
app.use(express.json());

const { PORT } = process.env;
const corsOptions = {
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

//#region Visualizar Imagens
/*------------------------------------------------------------------------------------ */
//app.get('/uploads/:filename', (req, res) => {
//  const { filename } = req.params;
//  res.sendFile(path.join(__dirname, 'uploads', filename));
//});
//#endregion


//#region Visualizar Imagens Cloudinary download (by asset ID)
/*------------------------------------------------------------------------------------ */
//https://api.cloudinary.com/v1_1/demo/asset/download?asset_id=wu1js8tlwoib7839a0bkw&attachment=true&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af
app.get('/download/:asset_id', (req, res) => {
  const { asset_id } = req.params;
  const { signature, timestamp, apiKey, cloud_name, api_secret, folder } = getCloudinarySetData(); // Ensure signature and timestamp are set
console.log(`Config data: signature=${signature}, timestamp=${timestamp}, apiKey=${apiKey}, cloud_name=${cloud_name}, api_secret=${api_secret}, folder=${folder}`);

//mount the URL for Cloudinary download
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/asset/download?asset_id=${asset_id}&attachment=true&timestamp=${timestamp}&api_key=${apiKey}&signature=${signature}`;

  res.redirect(cloudinaryUrl);
});
/*------------------------------------------------------------------------------------ */
//#endregion


//#region Upload de Imagens
/*------------------------------------------------------------------------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define a pasta onde a imagem será salva
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define o nome do arquivo (nome original + data atual para evitar duplicatas)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota para receber a imagem (campo 'imagem' no formulário)
app.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  
  const r = passingDataToFrontend(req.file.filename, ); // Call the function to send data to Cloudinary

  let jsonResp = {
    SERVIDOR: `Imagem salva com sucesso: ${req.file.filename}`,
    CLOUDINARY: `Imagem salva com sucesso:`
  } + r;

  res.send(jsonResp);
});
/*------------------------------------------------------------------------------------ */
//#endregion


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
