import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlware";
import { findByIdUserService } from "../services/user.server";
import { HTTPSTATUS } from "../config/http.config";
import { updateUserSchema } from "../validators/user.validator";
import { updateUserService } from "../services/user.server";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await findByIdUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      user,
    });
  }
);


export const updateUserController = asyncHandler(
    async (req: Request, res: Response) => {
      const body = updateUserSchema.parse(req.body);
      const userId = req.user?._id;
      const profilePic = req.file;
  
      const user = await updateUserService(userId, body, profilePic);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "User profile updated successfully",
        data: user,
      });
    }
  );
