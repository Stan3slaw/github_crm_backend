import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email', 60).nullable().unique();
      table.string('password', 255).notNullable();
      table.timestamps(true, true);
    })
    .then(async () => {
      await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_users()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    CREATE OR REPLACE TRIGGER update_users_updated_at
      BEFORE UPDATE
      ON users
      FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_users();
`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER IF EXISTS update_users_updated_at ON users;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_users;');
  await knex.schema.dropTableIfExists('users');
}
