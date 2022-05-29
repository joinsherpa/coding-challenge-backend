
## Setup

This repository contains the skeleton of a NodeJS Express app in TypeScript and an SQLite database, to which you will add functionality. The code here was built for node version 14.

The first step is to run `npm i` to install the required dependencies.

A handful of scripts are provided:

`npm run build` will build the application

`npm run start` will start the application 

`npm run test` will run the tests.

`npm run migrate` will seed the database 

`npm run seed` will seed the database 

`npm run clean` will delete data from the database 

`npm run generateData` should be executed in order to populate a json file at `data/data.json` into the SQLite database. This is required
because it is necessary to set dates for events to be in the near future.

