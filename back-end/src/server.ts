require('dotenv').config();
const port = Number(process.env.server_port);
const server_url = String(process.env.server_url);

import path from 'path';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(port, () => {
  console.log(Array(40).fill('\n').join(''));
  console.log(`listening on: ${server_url}:${port}`);
});