import { cartModel } from './models/cart.model.js'
import { productModel } from './models/product.model.js'
import mongoose from 'mongoose'


class CartManager {

    async createNewCart() {
        /**
        * Creates new Cart doc in MongoDB 
        */
        const response = await cartModel.create({products: []})
        return response
    }

    async getCartProductsById(id) {
        /**
        * Returns the Products subdoc array from specific Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw `Cart ID ${id} is not a valid format`
        }

        const query = cartModel.findById(id).lean()
        const cart = await query.exec()

        if (!cart) {
            throw `Cart with ID ${id} does not exist`
        }
        return cart.products
    }

    async addProductToCart(cartId, productId, productQuantity) {
        /**
        * Creates the Product subdoc to the specified Cart doc array in MongoDB, or adds to existing one
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw `Product ID ${productId} is not a valid format`
        }

        const productQuery = productModel.findById(productId).lean()
        const product = await productQuery.exec()
        if (!product) {
            throw `Product ${productId} does not exist`
        }

        const productInCart = await cartModel.findOne({
            $and: [{ _id: cartId }, { "products.product": productId }]
        })

        let updateQuery = cartModel.updateOne(
            { _id: cartId, "products.product": productId },
            { $inc: { "products.$.quantity": productQuantity } }
        )

        if (!productInCart) {
            updateQuery = cartModel.updateOne(
                { _id: cartId },
                {
                    $addToSet: {
                        products: {
                            product: productId,
                            quantity: productQuantity
                        }
                    }
                }
            )
        }

        await updateQuery.exec()
        return await this.getCartProductsById(cartId)
    }

    async deleteCart(id) {
        /**
        * Deletes Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw `Cart ID ${id} is not a valid format`
        }

        const query = cartModel.findByIdAndDelete(id).lean()
        const response = await query.exec()

        if (!response) {
            throw `Cart with ID ${id} does not exist`
        }
        return response
    }

    async deleteProductFromCart(cartId, productId) {
        /**
        * Deletes Product in subdoc array in Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw `Product ID ${productId} is not a valid format`
        }

        const productInCart = await cartModel.findOne({
            $and: [{ _id: cartId }, { "products.product": productId }]
        })

        if (!productInCart) {
            throw `Product with ID ${productId} not in cart ${cartId}`
        }

        let updateQuery = cartModel.updateOne(
            { _id: cartId, "products.product": productId },
            {
                $pull: {
                    "products": {
                        "product": productId
                    }
                }
            }
        )

        await updateQuery.exec()
        return await cartModel.findById(cartId).lean().exec()

    }
}

export default CartManager