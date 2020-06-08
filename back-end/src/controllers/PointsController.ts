require('dotenv').config();

const port = Number(process.env.server_port);
const server_url = String(process.env.server_url);
const image_base_url = `${server_url}:${port}/uploads/points/`;

import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    let points;

    if (items) {
      const parsedItems = String(items).split(',').map(item => Number(item.trim()));

      points = await knex('point')
        .join('point_item', 'point_item.point_id', 'point.id')
        .whereIn('point_item.item_id', parsedItems)
        .where('point.city', String(city))
        .where('point.uf', String(uf))
        .distinct()
        .select('point.*');
    } else {
      points = await knex('point')
        .where('point.city', String(city))
        .where('point.uf', String(uf))
        .distinct()
        .select('*');
    }
    // .join('item', 'point_item.item_id');

    if (points) {
      // const items = await knex('item')
      //   .join('point_item', 'item.id', '=', 'point_item.item_id')
      //   .where('point_item.point_id', id)
      //   .select('item.title', 'item.image');

      // return res.status(200).json({ status: 'succes', data: { ...points, items } })
      const serialized_points = points.map((point) => ({ ...point, image_url: `${image_base_url}${point.image}` }));
      return res.status(200).json(serialized_points)
    } else {
      return res.status(400).json({ status: 'failed' })
    }
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('point').where('id', id).select().first();

    if (point) {

      const items = await knex('item')
        .join('point_item', 'item.id', '=', 'point_item.item_id')
        .where('point_item.point_id', id)
        .select('item.title', 'item.image');

      // return res.status(200).json({ status: 'succes', data: { ...point, items } })
      return res.status(200).json({ ...point, image_url: `${image_base_url}${point.image}`, items })
    } else {
      return res.status(400).json({ status: 'failed' })
    }
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;

    const transaction = await knex.transaction();

    const point = {
      name,
      image: req.file.filename,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    const insertedIds = await transaction('point').insert(point);

    const point_id = insertedIds[0];

    if (insertedIds) {
      if (items.length > 0) {
        await transaction('point_item').insert(
          items.split(',')
            .map((item: string) => Number(item.trim()))
            .map((item: number) => ({ point_id, item_id: item }))
        );
      }
      await transaction.commit();
      res.send({ status: 'created', data: { id: point_id, ...point, items } });
    } else {
      res.send({ status: 'failed' })
    }

  }

}

export default PointsController;