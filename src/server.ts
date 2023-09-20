import express from "express";
import router from "./router/router";
import chalk from "chalk";
import morgan from "./logger/morgan";
import cors from "./cors/cors";
import { connectDb } from "./db/pgAdmin_connect";
import { runQuery } from "./dal/pgAdminDal";

const app = express();
const PORT = 8181;

// Middleware
app.use(morgan);
app.use(cors);
app.use(express.json());
app.use(router);


// Start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(chalk.blueBright(`\nServer listening on port: ${PORT}...`));
  });
};


// Conecting to database.
connectDb()
  .then(async () => {
    console.log("\n<==== Connected to postgresSQL ====>");
    await runQuery()
    startServer();
  })
  .catch((error) => console.error(chalk.redBright(`${error.message}.\nStatus code:${error.status}.`)));
