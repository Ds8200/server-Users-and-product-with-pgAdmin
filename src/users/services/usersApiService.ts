import { comparePassword, generateUserPassword } from "../helpers/bcrypt";
import { UserDAL, ProductDAL } from '../../dataAccess/postgreSQL_DAL'; // Import ProductDAL as well
import chalk from 'chalk';
import UserInterface from '../interfaces/UserInterface';
import pgPromise from "pg-promise";

type UserResult = Promise<UserInterface[] | null>;

// Get all users
export const getUsers = async (): UserResult => {
    try {
        const users = await UserDAL.getAllUsers();
        if (!users || users.length === 0) {
            throw new Error('No users in the database');
        }
        return users;
    } catch (error) {
        console.log(chalk.redBright(error));
        return Promise.reject(error);
    }
};

// Get user by ID
export const getUser = async (userId: string): UserResult => {
    try {
        const user = await UserDAL.getUserById(userId);
        if (!user || user.length === 0) {
            throw new Error('No user with this ID in the database!');
        }
        return user;
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Create a new user
export const register = async (user: UserInterface): UserResult => {
    try {
        user.password = generateUserPassword(user.password);

        await UserDAL.createUser(user);
        console.log(user);
        return [user];
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Edit user
export const updateUser = async (userId: string, userForUpdate: UserInterface): UserResult => {
    try {
        if(userForUpdate.password){
            userForUpdate.password = generateUserPassword(userForUpdate.password);
        }
        const updatedUser = await UserDAL.updateUser(userId, userForUpdate);
        if (!updatedUser) {
            throw new Error('Could not edit this user');
        }
        return updatedUser;
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Login
export const login = async (userFromClient: UserInterface): Promise<string> => {
    try {
        const userInDB = await UserDAL.getUserByEmail(userFromClient.email);
        if (!userInDB) {
            throw new Error('The email or password is incorrect');
        }

        if (!comparePassword(userFromClient.password, userInDB[0].password)) {
            throw new Error('The email or password is incorrect');
        }

        return 'You are logged in!';
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Delete user
export const deleteUser = async (userId: string): UserResult => {
    try {
        const deletedUser = await UserDAL.deleteUser(userId);
        if (!deletedUser) {
            throw new Error('Could not delete this user');
        }
        return deletedUser;
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Add product to user
export const addProductToUser = async (userId: string, productFromClient: string): Promise<any> => {
    try {
        const prodId = await ProductDAL.createProduct(productFromClient); // Use ProductDAL to create a product
        if (!prodId) throw Error("Product not added!!!")
        return ProductDAL.addProductToUser(userId, prodId);

    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

// Delete all products for a user
export const deleteAllProductToUser = async (userId: string): Promise<number> => {
    try {
        const deleteCount = await ProductDAL.deleteAllProductsFromUser(userId); // Use ProductDAL to delete products for the user
        if (deleteCount === 0) {
            throw new Error('Not products of user id!!!');
        }
        return deleteCount;
    } catch (error) {
        console.log(chalk.redBright(error));
        throw error;
    }
};

