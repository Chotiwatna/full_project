const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//get products
const getProducts = async (req, res) => {
    const products = await prisma.products.findMany();
    res.json(products);
};

//get only 1 product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.products.findUnique({
            where: {
                product_id: parseInt(id),
            },
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//insert product
const createProduct = async (req, res) => {
    const { product_id, name, description, price, category, image_url } = req.body;
    try {
        const newProduct = await prisma.products.create({
            data: {
                product_id: product_id,
                name: name,
                description: description,
                price: price,
                category: category,
                image_url: image_url
            }
        });
        res.status(201).json({
            message: `Product with id ${newProduct.product_id} is created successfully`,
            newProduct,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//update product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    try {
        const product = await prisma.products.update({
            where: {
                product_id: parseInt(id),
            },
            data: {
                name: name,
                description: description,
                price: price,
                category: category,
                image_url: image_url
            },
        });
        res.json({
            message: `Product with id ${product.product_id} is updated successfully`,
            product,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//delete product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.products.delete({
            where: {
                product_id: parseInt(id),
            },
        });
        res.status(200).json({ message: `Product with id ${id} is deleted` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };