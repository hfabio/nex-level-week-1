import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('point', table => {
    table.increments('id').primary();
    table.string('image', 255).notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('whatsapp', 255).notNullable();
    table.decimal('latitude').notNullable();
    table.decimal('longitude').notNullable();
    table.string('city', 255).notNullable();
    table.string('uf', 2).notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable('point');
};