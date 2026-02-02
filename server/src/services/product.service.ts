import { Product, CreateProductDTO, UpdateProductDTO } from '../models/product.model.js';

export const getAllProducts = async () => {
    return await Product.find({ isActive: true });
};

export const getProductById = async (id: string) => {
    return await Product.findById(id);
};

export const createProduct = async (data: any) => {
    const newProduct = new Product(data);
    return await newProduct.save();
};

export const updateProduct = async (id: string, data: UpdateProductDTO) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string) => {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
};
