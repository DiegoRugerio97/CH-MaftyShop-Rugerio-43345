import mongoose from "mongoose"

const cartCollection = 'carts'

const productInCartSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    products: {
        type: [productInCartSchema],
        required: true,
        default: []
    }
})


export const cartModel = mongoose.model(cartCollection, cartSchema)