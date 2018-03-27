ES Server
=========

Dev Setup
---------

Ensure you have a PostgreSQL database named "es_dev" created on the current system. If required, connection string logic can be amended in `knexfile.ts`. The default NODE_ENV is `development`.

    yarn install
    yarn run knex-migrate

One time seed data install
--------------------------

Navigate to http://localhost:8084/seed-demo-data

Running app
-----------

Ensure you have built the `client` project first! Then run:

    yarn run watch

Application should now run at http://localhost:8084/
