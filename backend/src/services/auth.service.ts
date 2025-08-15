import UserModel from "../models/user.model";
import { UnauthorizedException } from "../utils/app-error";
import { RegisterSchemaType } from "../validators/auth.validator";
import ReportSettingModel from "../models/report-setting.model";
import mongoose from "mongoose";
import { ReportFrequencyEnum } from "../models/report-setting.model";
import { calculateNextReportDate } from "../utils/helper";
import { LoginSchemaType } from "../validators/auth.validator";
import { NotFoundException } from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";



export const registerService = async (body: RegisterSchemaType) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const existingUser = await UserModel.findOne({ email: body.email }).session(session);
            if (existingUser) throw new UnauthorizedException("User already exists");

            const newUser = new UserModel({
                ...body,
            });

            await newUser.save({ session });

            const reportSetting = new ReportSettingModel({
                userId: newUser._id,
                frequency: ReportFrequencyEnum.MONTHLY,
                isEnabled: true,
                lastSentDate: null,
                nextReportDate: calculateNextReportDate(),
            });

            await reportSetting.save({ session });
        });
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
};

export const loginService = async (body: LoginSchemaType) => {
    const { email, password } = body;
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("Email/password not found");

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email/password");
      }
      
      const { token, expiresAt } = signJwtToken({ userId: user.id });
      
      const reportSetting = await ReportSettingModel.findOne(
        { userId: user.id },
        { _id: 1, frequency: 1, isEnabled: 1 }
      ).lean();
      
      return {
        user: user.omitPassword(),
        accessToken: token,
        expiresAt,
        reportSetting
      }
        
};

