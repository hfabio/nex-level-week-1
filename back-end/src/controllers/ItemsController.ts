import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController {
  async index(req: Request, res: Response) {

    const items = await knex('item').select();
    const mutatedItems = items.map(item => ({ ...item, image: `http://192.168.0.25:3333/uploads/${item.image}` }));

    return res.json(mutatedItems);
  }
}

export default ItemsController;