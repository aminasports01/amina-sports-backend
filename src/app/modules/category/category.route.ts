import { Router } from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

router.post("/", accessRole, CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", accessRole, CategoryController.getSingleCategory);

router.patch("/:id", accessRole, CategoryController.updateCategory);

router.delete("/:id", accessRole, CategoryController.deleteCategory);

export const categoryRoutes = router;
