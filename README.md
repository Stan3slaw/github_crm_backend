## Dependecies Instaliation
Go to the root folder (where you cloned repository) and run:
```bash
pnpm i
```

## Project Setting Up
In root directory find the .env.sample file and create .env file according to it.

## Usage

```bash
docker compose up
```

### PostgreSQL
Creating migrations using knex.js migrating feature. In this project knex.js is using to manipulate PostgreSQL database.
After Docker container started run these commands inside container:

- Running existed migrations (will create tables, since there is creating tables migration)
    ```bash
    pnpm migration:up
    ```

- Generating new migrations in folder with migrations, in this case ./src/common/database/knex/migrations/
    ```bash
    pnpm migration:create <NameOfTheMigration>
    ```

- Roll back the latest migration
    ```bash
    pnpm migration:rollback
    ```
  
- Show list of migrations
    ```bash
    pnpm migration:list
    ```