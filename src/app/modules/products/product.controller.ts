// product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from './product.service';

const createProduct = async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: result,
  });
};

const getAllProducts = async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: result,
  });
};

const getSingleProduct = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await ProductService.getSingleProduct(slug as string);

  res.status(200).json({
    success: true,
    message: 'Product fetched successfully',
    data: result,
  });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.updateProduct(id as string, req.body);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id as string);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
