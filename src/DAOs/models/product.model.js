import mongoose from "mongoose"

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    thumbnails: {
        type: Array,
        default: ["/img/placeholder.jpg"]
    }
})


export const productModel = mongoose.model(productCollection, productSchema)