# Coffee Mug recruitment task app

This repository contains the solution to the recruitment task - an app implementing a simple store inventory and order management system.

This branch contains an initial "Hello world" app. As per the task instructions, the management system is implemented in [PR #1](https://github.com/marcin-wrona-500/coffee-mug-recruitment-task/pull/1) on the [feature/inventory-management-system](https://github.com/marcin-wrona-500/coffee-mug-recruitment-task/tree/feature/inventory-management-system) branch.

## Setup

The app implements a Node.JS HTTP server, using Express.JS and the prisma ORM for database access. The database used is MariaDB v10.11.10. The configuration for the app is done using environment variables, the description and default values for which are included in the [.env](./.env) file. The settings may be overriden using the [.env.local](./.env.local) file, which is to be kept uncommited.

The database structure may be created using either the `prisma migrate` command or the included [MySQL Workbench model](./prisma/db.mwb).

Before running the program, the prisma client needs to be generated using the `prisma generate` command, and the Typescript code needs to be compiled using the provided `build` script in `package.json`. Then, the program may be run using the standard `start` script.
