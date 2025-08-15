import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "./config/passport.config"
import cors from "cors";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middlware";
import { BadRequestException } from "./utils/app-error";
import connectDatabase from "./config/database.config"
import authRoutes from "./routes/auth.route";
import passport from "passport";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import reportRoutes from "./routes/report.route";
import analyticsRoutes from "./routes/analytics.route";



const app = express();
const BASE_PATH = Env.BASE_PATH;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize())

app.use(
    cors({
        origin: Env.FRONTEND_ORIGIN,
        credentials: true,
    })
);

app.get(
    "/",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      throw new BadRequestException("This is a test error");
      res.status(HTTPSTATUS.OK).json({
        message: "I hope it works!",
      });
    })
  );
  


app.use(errorHandler)
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthenticateJwt, transactionRoutes);
app.use(`${BASE_PATH}/report`, passportAuthenticateJwt, reportRoutes);
app.use(`${BASE_PATH}/analytics`, passportAuthenticateJwt, analyticsRoutes);


app.listen(Env.PORT, async () => {
    await connectDatabase();
    console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});