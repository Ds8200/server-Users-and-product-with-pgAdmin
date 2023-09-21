import { comparePassword, generateUserPassword } from "../helpers/bcrypt";
import { UserDAL, ProductDAL } from '../../dal/pgAdminDal'; // Import ProductDAL as well
import UserInterface from '../interfaces/UserInterface';
import { userPg } from "../interfaces/UserInterface";


type UserResult = Promise<UserInterface[] | null>;

// Get all users
export const getUsers = async (): UserResult => {
    const users = await UserDAL.getAllUsers();
    if (!users || users.length === 0) {
        throw new Error('No users in the database');
    }
    return users;
};

// Get user by ID
export const getUser = async (userId: string): UserResult => {
    const user = await UserDAL.getUserById(userId);
    if (!user || user.length === 0) {
        throw new Error('No user with this ID in the database!');
    }
    return user;
};

// Create a new user
export const register = async (user: UserInterface): UserResult => {
    user.password = generateUserPassword(user.password);

    await UserDAL.createUser(user);
    console.log(user);
    return [user];
};

// Edit user
export const updateUser = async (userId: string, userForUpdate: UserInterface): UserResult => {
    if (userForUpdate.password) {
        userForUpdate.password = generateUserPassword(userForUpdate.password);
    }
    const updatedUser = await UserDAL.updateUser(userId, userForUpdate);
    if (!updatedUser) {
        throw new Error('Could not edit this user');
    }
    return updatedUser;
};

// Login
export const login = async (userFromClient: UserInterface): Promise<userPg[] | null> => {
    const userInDB: userPg[] | null = await UserDAL.getUserByEmail(userFromClient.email);
    if (!userInDB) {
        throw new Error('The email is incorrect');
    }

    if (!comparePassword(userFromClient.password, userInDB[0].password)) {
        throw new Error('The password is incorrect');
    }

    return userInDB;
};

// Delete user
export const deleteUser = async (userId: string): UserResult => {
    const deletedUser = await UserDAL.deleteUser(userId);
    if (!deletedUser) {
        throw new Error('Could not delete this user');
    }
    return deletedUser;
};

// Add product to user
export const addProductToUser = async (userId: string, productFromClient: string): Promise<any> => {
    const prodId = await ProductDAL.createProduct(productFromClient); // Use ProductDAL to create a product
    if (!prodId) throw Error("Product not added!!!")
    return ProductDAL.addProductToUser(userId, prodId);
};

// Delete all products for a user
export const deleteAllProductToUser = async (userId: string): Promise<number> => {
    const deleteCount = await ProductDAL.deleteAllProductsFromUser(userId); // Use ProductDAL to delete products for the user
    if (deleteCount === 0) {
        throw new Error('Not products of user id!!!');
    }
    return deleteCount;
};

