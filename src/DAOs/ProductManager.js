import { productModel } from './models/product.model.js'
import mongoose from 'mongoose'

class ProductManager {

    async getProducts(limit = null) {
        /**
        * Reads from MongoDB and returns the query promise for all documents,optional limit
        */
        let query = productModel.find().lean()
        if (limit) {
            query = productModel.find().limit(limit)
        }
        return await query.exec()
    }

    async getProductById(id) {
        /**
        * Reads from MongoDB and returns the product with specified id
        */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw `ID ${id} is not a valid format`
        }

        let query = productModel.findById(id).lean()
        const product = await query.exec()

        if (!product) {
            throw `Product with ID ${id} does not exist`
        }
        return product
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        /**
        * Creates new document in MongoDB
        */
        let newDoc = { title: title, description: description, code: code, price: price, status: status, stock: stock, category: category, thumbnails: thumbnails }
        const response = await productModel.create(newDoc)
        return response
    }

    async updateProduct(id, doc) {
        /**
        * Updates document in MongoDB for product with specified id
        */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw `ID ${id} is not a valid format`
        }
        let query = productModel.findByIdAndUpdate(id, doc, { returnDocument: "after" }).lean()
        const response = await query.exec()
        if (!response) {
            throw `Product with ID ${id} does not exist`
        }
        return response
    }

    async deleteProduct(id) {
        /**
        * Deletes document in MongoDB for product with specified id
        */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw `ID ${id} is not a valid format`
        }
        let query = productModel.findByIdAndDelete(id).lean()
        const response = await query.exec()
        if (!response) {
            throw `Product with ID ${id} does not exist`
        }
        return response
    }
}

export default ProductManager