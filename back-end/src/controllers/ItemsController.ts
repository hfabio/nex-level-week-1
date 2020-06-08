require('dotenv').config();

const port = Number(process.env.server_port);
const server_url = String(process.env.server_url);
const image_base_url = `${server_url}:${port}/uploads/`;


import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController {
  async index(req: Request, res: Response) {

    const items = await knex('item').select();
    const mutatedItems = items.map(item => ({ ...item, image: `${image_base_url}${item.image}` }));

    return res.json(mutatedItems);
  }
}

export default ItemsController;