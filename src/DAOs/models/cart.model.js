import mongoose from "mongoose"

const cartCollection = 'carts'

const productInCartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    quantity: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    products: {
        type: [productInCartSchema],
        default: []
    }
})


export const cartModel = mongoose.model(cartCollection, cartSchema)