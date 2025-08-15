import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middlware";
import { registerSchema } from "../validators/auth.validator";
import { registerService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";
import { loginService } from "../services/auth.service";

export const RegisterController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result =  await registerService(body)

    return res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User registered successfully" ,
        data: result
      });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const { user, accessToken, expiresAt, reportSetting } =
      await loginService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
      reportSetting,
    });
  }
);