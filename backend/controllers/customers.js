const { PrismaClient } = require('@prisma/client');
const e = require('express');
const prisma = new PrismaClient();

//insert a new customer
const createCustomer = async (req, res) => {
    const {customer_id, first_name, last_name, address, email, phone_number} = req.body;
    try {
        const cust = await prisma.customers.create({
            data: {
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with id ${cust.customer_id} is created successfully`
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Error while creating the user",
            error: err.message
        });
    }
};

//get all customers
const getCustomers = async (req,res) => {
    const custs = await prisma.customers.findMany();
    res.json(custs);
};

//get only one customer by id
const getCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.customers.findUnique({
            where: {customer_id: Number(id)},
        });
        if (!cust) {
            res.status(404).json({message: 'Customer not found'});
            return;
        } else {
            res.status(200).json(cust);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

//delete a customer by customer_id
const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        //ตรวจสอบว่ามี customer_id นี้อยู่หรือไม่
        const existingCustomer = await prisma.customers.findUnique({
            where: {customer_id: Number(id)}
        });
        //ถ้าไม่มี customer นี้อยู่
        await prisma.customers.delete({
            where: {customer_id: Number(id)}
        });
        res.status(200).json({
            status: "ok",
            message: `Customer with id ${id} is deleted successfully`
        });
    } catch (err) {
        console.error('Delete customer error:',err);
        res.status(500).json({error: err.message});
    }
};

const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const {first_name, last_name, address, email, phone_number} = req.body;
    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (email) data.email = email;
    if (phone_number) data.phone_number = phone_number;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Please provide the data to update"
        });
    }
    try {
        const cust = await prisma.customers.update({
            where: {customer_id: Number(id)},
            data
        });
        res.status(200).json({
            status: "ok",
            message: `Customer with id = ${id} is updated successfully`,
            user: cust
        });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({
                status: "error",
                message: "Email already exists"
            });
        } else if (err.code === 'P2025') {
            return res.status(404).json({
                status: "error",
                message: `User with id  = ${id} not found`
            });
        } else {
            console.error('Update Customer error', err
            );
            res.status(500).json({
                status: "error",
                message: "Error updating customer",
                error: err.message
            });
        }
    }
}


module.exports = {
    createCustomer, getCustomers, getCustomer, deleteCustomer, updateCustomer
};