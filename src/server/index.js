// untuk menyiapkan server Express agar bisa menerima data JSON dan mengatur alamat (endpoint) API secara rapi dan terpisah

import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js';

const app = express();

// app.use(cors({
//   origin: 'https://notesapp-v2.dicodingacademy.com',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(cors());

app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

export default app;