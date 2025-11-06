import { Request, Response } from "express";
import User from "../models/user.model";
import { userSchema } from "../validations/user.validation";

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body); // Validate input
    const user = await User.create(req.body);

    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    res.status(200).json({
      success: false,
      message: "Error creating user",
    });
  }
};

//  Get All Users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch {
    res.status(200).json({ success: false, message: "Error fetching users" });
  }
};

//  Get Single User by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch {
    res.status(200).json({ success: false, message: "Error fetching user" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    userSchema.partial().parse(req.body); // Validate only provided fields

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    res
      .status(200)
      .json({ success: false, message: "Error updating user" });
  }
};

//  Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch {
    res.status(200).json({ success: false, message: "Error deleting user" });
  }
};
