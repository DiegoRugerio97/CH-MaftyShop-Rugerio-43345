
import fs from 'fs'
import { uid } from 'uid'

class CartManager {

    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    // Main methods
    createNewCart() {
        /**
        * This method reads from the file, adds the cart to the array, and writes the file again to the specified file.
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} In case something goes wrong during any step, rejects the promise.
        */

        return this.#readCartsFromFile()
            .then(() => this.#registerCart())
            .then(() => this.#writeCartsToFile())
            .catch(e => { return Promise.reject(e) })
    }

    getCartProductsById(id) {
        /**
        * This method reads from the file and returns a products array of specified cart by id if it exists.
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} In case specified cart by id doesn't exists, rejects the promise.
        */
        return this.#readCartsFromFile()
            .then(() => { return this.carts.find(cart => cart.id === id) ?? Promise.reject("Cart not found.") })
            .then((cartProducts => { return cartProducts.products }))
    }

    addProductToCart(cartId, productId, productQuantity) {
        /**
        * This method reads from the file, adds the product to the specified cart and writes the array to the file
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} In case cart id doesn't exist rejects the promise
        */
        return this.#readCartsFromFile()
            .then(() => {
                let cartIndex = this.carts.findIndex(cart => cart.id === cartId)
                if (cartIndex === -1) {
                    return Promise.reject("Cart not found.")
                }
                return cartIndex
            })
            .then((cartIndex) => { return this.carts[cartIndex].products })
            .then((cartProducts) => {
                let productIndex = cartProducts.findIndex(p => p.product === productId)
                if (productIndex === -1) {
                    cartProducts.push({
                        product: productId,
                        quantity: productQuantity
                    })
                }
                else {
                    let newQuantity = cartProducts[productIndex].quantity + productQuantity
                    cartProducts[productIndex].quantity = newQuantity
                }
            })
            .then(() => this.#writeCartsToFile())
            .then(() => { return Promise.resolve(`Cart with id ${cartId}, succesful addition of product ${productId}, ${productQuantity} items`) })
            .catch(e => { return Promise.reject(e) })
    }

    deleteCart(id) {
        /**
        * This method reads from the file, deletes the specified cart if it exists.
        *
        * @returns {Promise<Token>} Method returns chain of promises, which deletes the cart
        * @throws {Promise<Token>} In case id doesn't exists, rejects the promise.
        */
        return this.#readCartsFromFile()
            .then(() => this.carts.find(cart => cart.id === id) ?? Promise.reject("Cart not found."))
            .then(() => { return this.carts.filter(cart => cart.id != id) })
            .then(filteredCarts => this.carts = filteredCarts)
            .then(() => this.#writeCartsToFile())
            .then(() => { return Promise.resolve(`Cart with id ${id} deleted`) })
            .catch(e => { return Promise.reject(e) })
    }

    deleteProductFromCart(cartId, productId) {
        /**
        * This method reads from the file, adds the product and writes the array to the file.
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} In case cart id or product id doesn't exist in cart rejects the promise
        */
        return this.#readCartsFromFile()
            .then(() => {
                let cartIndex = this.carts.findIndex(cart => cart.id === cartId)
                if (cartIndex === -1) {
                    return Promise.reject("Cart not found.")
                }
                return cartIndex
            })
            .then((cartIndex) => { return this.carts[cartIndex].products })
            .then((cartProducts) => {
                let productIndex = cartProducts.findIndex(p => p.product === productId)
                if (productIndex == -1) {
                    return Promise.reject(`Product ${productId} in cart not found.`)
                }
                else {
                    return cartProducts.filter(p => p.product !== productId)
                }
            })
            .then((filteredProducts) => {
                let cartIndex = this.carts.findIndex(cart => cart.id === cartId)
                return this.carts[cartIndex].products = filteredProducts
            })
            .then(() => this.#writeCartsToFile())
            .then(() => { return Promise.resolve(`Cart with id ${cartId}, succesful deletion of product ${productId}`) })
            .catch(e => { return Promise.reject(e) })
    }
    // Utility methods
    #registerCart() {
        /**
        * Creates new cart in array and assigns automatically unique ID.
        *
        * @returns {void} This method only pushes empty cart to array.
        */
        const ID_LENGHT = 8
        let id = uid(ID_LENGHT)

        this.carts.push({
            id: id,
            products: []
        })
    }

    // Promise methods
    #writeCartsToFile() {
        /**
        * This method writes the stringified array to the file in path.
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} If something fails, promise is rejected.
        */
        return fs.promises.writeFile(this.path, JSON.stringify(this.carts), 'utf-8')
            .then(() => { return Promise.resolve(`File was written with ${this.carts.length} items.`) })
            .catch((e) => { return Promise.reject(`File couldn't be saved`) })
    }

    #readCartsFromFile() {
        /**
        * This method reads the file, parse the JSON content and loads the carts array.
        *
        * @returns {Promise<Token>} Method returns chain of promises
        * @throws {Promise<Token>} If something fails, promise is rejected.
        */
        return fs.promises.readFile(this.path, 'utf-8')
            .then(data => { return JSON.parse(data) })
            .then(parsedData => this.carts = parsedData)
            .catch(e => { return Promise.reject(`File couldn't be read ${e}`) })
    }
}

export default CartManager