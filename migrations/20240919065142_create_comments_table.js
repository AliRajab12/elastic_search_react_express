exports.up = function(knex) {
  return knex.schema.createTable('comments', function(table) {
    table.increments('id').primary();     // Auto-incrementing ID
    table.string('text').notNullable();   // Comment text
    table.timestamp('date').defaultTo(knex.fn.now()); // Timestamp
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments'); // Rollback step
};