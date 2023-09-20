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
const router = express.Router();

router.get("/", handleGetUsers);
router.get("/:id", handleGetUser);
router.post("/", handleUserRegistration);
router.put("/:id", handleUpdateUser);
router.delete("/:id", handleDeleteUser);
router.post("/login", handleLogin);
router.post("/add-product/:id", handleAddProductToUser);
router.delete("/deleteAll-product/:id", handleDleleteAllProductToUser);

export default router;
