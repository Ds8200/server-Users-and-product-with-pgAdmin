import morgan from "morgan";
import { morganTime } from "../utils/timeService";
import chalk from "chalk";

const morganLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const morganString = [
    morganTime(),
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "-",
    tokens["response-time"](req, res),
    "MS",
  ].join(" ");

  if (+status! >= 400) return chalk.redBright(morganString);
  return chalk.cyanBright(morganString);
});

export default morganLogger;
