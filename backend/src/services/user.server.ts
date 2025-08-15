import UserModel from "../models/user.model";
import { UpdateUserType } from "../validators/user.validator";
import { NotFoundException } from "../utils/app-error";

export const findByIdUserService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
    userId: string,
    body: UpdateUserType,
    profilePic?: Express.Multer.File
  ) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");
  
    if (profilePic) {
      user.profilePicture = profilePic.path;
    }
  
    user.set({
      name: body.name,
    });
  
    await user.save();
  
    return user.omitPassword();
  };