import { Router } from "express";
import { createTransactionController, getAllTransactionController, getTransactionByIdController, duplicateTransactionController, updateTransactionController, deleteTransactionController, bulkDeleteTransactionController, bulkTransactionController, scanReceiptController } from "../controllers/transaction.controller";
import { upload } from "../config/cloudinary.config";

const transactionRoutes = Router();

transactionRoutes.put("/duplicate/:id", duplicateTransactionController);
transactionRoutes.put("/update/:id", updateTransactionController);
transactionRoutes.post("/bulk-transaction", bulkTransactionController);
transactionRoutes.post("/scan-receipt",upload.single("receipt"),scanReceiptController);

transactionRoutes.post("/create", createTransactionController);
transactionRoutes.get("/all", getAllTransactionController);
transactionRoutes.get("/:id", getTransactionByIdController);

transactionRoutes.delete("/delete/:id", deleteTransactionController);
transactionRoutes.delete("/bulk-delete", bulkDeleteTransactionController);

export default transactionRoutes;
