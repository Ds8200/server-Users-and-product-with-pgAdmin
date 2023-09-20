import UserInterface from "../users/interfaces/UserInterface";
import { getUsers, register } from "../users/services/usersApiService";
import chalk from "chalk";

const data = {
  users: [
    { email: "regular@gmail.com", password: "Aa1234!" },
    { email: "business@gmail.com", password: "Aa1234!" },
    { email: "admin@gmail.com", password: "Aa1234!" },
  ],
};

export const generateInitialUsers = async () => {
  try {
    const usersInDB = await getUsers();
    if (Array.isArray(usersInDB) && usersInDB.length) return null;

    const users: UserInterface[] = [];
    for (const user of data.users) {
      try {
        const userInDB = await register(user);
        users.push(userInDB as UserInterface);
      } catch (error) {
        console.log(chalk.redBright("Could not register this user"));
      }
    }

    Promise.resolve(users);
  } catch (error) {
    console.log(chalk.redBright(error));
    Promise.reject(error);
  }
};
