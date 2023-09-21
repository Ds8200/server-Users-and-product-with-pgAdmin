import express from "express";
import {
  handleGetUser,
  handleGetUsers,
  handleUserRegistration,
  handleUpdateUser,
  handleDeleteUser,
  handleLogin,
  handleAddProductToUser,
  handleDleleteAllProductToUser
} from "../controllers/usersControllers";
import  JwtToken  from "../../token/token-jwt";


const router = express.Router();
router.post("/login", handleLogin);
router.post("/token",JwtToken.newToken)
router.get("/", JwtToken.verifyToken, handleGetUsers);
router.get("/:id", JwtToken.verifyToken, handleGetUser);
router.post("/", JwtToken.verifyToken, handleUserRegistration);
router.put("/:id", JwtToken.verifyToken, handleUpdateUser);
router.delete("/:id", JwtToken.verifyToken, handleDeleteUser);
router.post("/add-product/:id", JwtToken.verifyToken, handleAddProductToUser);
router.delete("/deleteAll-product/:id", JwtToken.verifyToken, handleDleleteAllProductToUser);

export default router;
