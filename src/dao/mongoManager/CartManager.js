import { cartModel } from '../model/cart.model.js'
import { productModel } from '../model/product.model.js'
import mongoose from 'mongoose'

class CartManager {

    async createNewCart() {
        /**
        * Creates new Cart doc in MongoDB 
        */
        const response = await cartModel.create({})
        return response
    }

    async getAllCarts() {
        /**
        * Returns all Cart docs from MongoDB
        */
        const query = cartModel.find().lean();
        return query.exec();
    }

    async getCartById(cartId) {
        /**
        * Returns the populated Products subdocs of Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }

        const query = cartModel.findById(cartId).populate("products._id").lean()
        const cart = await query.exec()

        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
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

        const product = await productModel.findById(productId)
        if (!product) {
            throw `Product with ID ${productId} does not exist`
        }

        const cart = await cartModel.findById(cartId).exec()
        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
        }

        const productInCart = cart.products.id(productId)
        if (!productInCart) {
            cart.products.addToSet({ _id: product._id, quantity: productQuantity })
        }
        else {
            productInCart.quantity += productQuantity
        }
        await cart.save()
        return await cartModel.findById(cartId).exec()
    }

    async updateCart(cartId, productsArray) {
        /**
        * Updates/overwrites Products array in Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }
        if (!Array.isArray(productsArray)) {
            throw `Incorrect body format on ${productsArray}`
        }
        const cart = await cartModel.findById(cartId).exec()
        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
        }
        cart.products = productsArray
        await cart.save()
        return await cartModel.findById(cartId).exec()
    }

    async updateQuantity(cartId, productId, productQuantity) {
        /**
        * Updates Product subdoc quantity in Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw `Product ID ${productId} is not a valid format`
        }

        const product = await productModel.findById(productId)
        if (!product) {
            throw `Product with ID ${productId} does not exist`
        }

        const cart = await cartModel.findById(cartId).exec()
        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
        }

        const productInCart = cart.products.id(productId)
        if (!productInCart) {
            throw `Product with ID ${productId} does not exist in Cart with ID ${cartId}`
        }
        else {
            productInCart.quantity = productQuantity
        }
        await cart.save()
        return await cartModel.findById(cartId).exec()
    }

    async deleteCart(cartId) {
        /**
        * Deletes Products subdocs in Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }

        const cart = await cartModel.findById(cartId).exec()
        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
        }

        cart.products = []
        await cart.save()
        return await cartModel.findById(cartId).exec()
    }

    async deleteProductFromCart(cartId, productId) {
        /**
        * Deletes specified Product subdoc in Cart doc from MongoDB
        */
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw `Cart ID ${cartId} is not a valid format`
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw `Product ID ${productId} is not a valid format`
        }

        const cart = await cartModel.findById(cartId).exec()
        if (!cart) {
            throw `Cart with ID ${cartId} does not exist`
        }

        const productInCart = cart.products.id(productId)
        if (!productInCart) {
            throw `Product with ID ${productId} does not exist in Cart with ID ${cartId}`
        }
        else {
            productInCart.deleteOne()
        }

        await cart.save()
        return await cartModel.findById(cartId).exec()
    }



}

export default CartManager

