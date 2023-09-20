import UserInterface from "../interfaces/UserInterface";
import {
  getUsers,
  getUser,
  register,
  updateUser,
  deleteUser,
  login,
  addProductToUser,
  deleteAllProductToUser
} from "../services/usersApiService";
import { handleError } from "../../utils/handleErrors";
import userValidation from "../models/joi/userValidation";
import { Request, Response } from "express";


export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.send(users);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    return res.send(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const user: UserInterface = req.body;

    const { error } = userValidation(user);
    if (error?.details[0].message) throw new Error(error?.details[0].message);

    const userFromDB = await register(user);

    return res.status(201).send(userFromDB);
  } catch (error) {
    if (error instanceof Error) handleError(res, error);
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: UserInterface = req.body;

    const { error } = userValidation(user);
    if (error?.details[0].message) throw new Error(error?.details[0].message);

    const userFromDB = await updateUser(id, user);
    return res.send(userFromDB);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    return res.send(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const userFromClient: UserInterface = req.body;

    const { error } = userValidation(userFromClient);
    if (error?.details[0].message) throw new Error(error?.details[0].message);

    const token = await login(userFromClient);
    return res.send(token);
  } catch (error) {
    handleError(res, error, 401);
  }
};

export const handleAddProductToUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { product } = req.query;

    const userWithProduct = await addProductToUser(id, String(product));
    if (!userWithProduct)
      throw new Error("Could not add this product to this user");

    return res.send(userWithProduct);
  } catch (error) {
    handleError(res, error);
  }
};

export const handleDleleteAllProductToUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteCount = await deleteAllProductToUser(id);
    return res.send({delete_count: deleteCount});
  } catch (error) {
    handleError(res, error);
  }
};
