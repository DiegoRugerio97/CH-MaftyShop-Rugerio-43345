import fs from 'fs'
import { uid } from 'uid'
class ProductManager {

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Main methods
  addProduct(title, description, code, price, status, stock, category, thumbnails) {
    /**
    * This method does reads from the file, adds the product to the array, and writes the file again to the specified file.
    *
    * @returns {Promise<Token>} Method returns chain of promises
    * @throws {Promise<Token>} In case number of arguments is incorrect, rejects the promise.
    */


    return this.#readProductsFromFile()
      .then(() => this.#registerProduct(title, description, code, price, status, stock, category, thumbnails))
      .then(() => this.#writeProductsToFile())
      .catch(e => { return Promise.reject(e) })
  }

  getProductById(id) {
    /**
    * This method reads from the file and returns a single product object if it exists.
    *
    * @returns @returns {Promise<Token>} Method returns chain of promises, which returns the specified object
    * @throws {Promise<Token>} In case ID doesn't exists, rejects the promise.
    */
    return this.#readProductsFromFile()
      .then(() => { return this.products.find(product => product.id === id) ?? Promise.reject("Product not found.") })
  }

  getProducts() {
    /**
    * This method reads from the file and returns the entire array of products.
    *
    * @returns {Promise<Token>} Method returns chain of promises, which returns products array
    * @throws {Promise<Token>} In case number of arguments is incorrect, rejects the promise.
    */
    return this.#readProductsFromFile().
      then(() => { return this.products ?? Promise.reject("Could not load products.") })
  }

  deleteProduct(id) {
    /**
    * This method reads from the file, deletes the specified product if it exists.
    *
    * @returns {Promise<Token>} Method returns chain of promises, which deletes the product
    * @throws {Promise<Token>} In case ID doesn't exists, rejects the promise.
    */
    return this.#readProductsFromFile()
      .then(() => this.products.find(product => product.id === id) ?? Promise.reject("Product not found."))
      .then(() => { return this.products.filter(product => product.id != id) })
      .then(filteredProducts => this.products = filteredProducts)
      .then(() => this.#writeProductsToFile())
      .then(() => { return Promise.resolve(`Product with id ${id} deleted`) })
      .catch(e => { return Promise.reject(e) })
  }

  updateProduct(id, obj) {
    /**
    * This method does reads from the file, retrieves the product to update and writes the array to the file.
    *
    * @returns {Promise<Token>} Method returns chain of promises, which updates product
    * @throws {Promise<Token>} In case the ID doesn't exist, rejects the promise
    */
    return this.#readProductsFromFile()
      .then(() => {
        let productIndex = this.products.findIndex(product => product.id === id)
        if (productIndex === -1) {
          return Promise.reject("Product not found.")
        }
        return productIndex
      })
      .then((productIndex) => this.products[productIndex] = { ...this.products[productIndex], ...obj })
      .then(() => this.#writeProductsToFile())
      .then(() => { return Promise.resolve(`Item with id ${id} updated succesfully`) })
      .catch(e => { return Promise.reject(e) })
  }

  // Utility methods
  #codeExists(code) {
    /**
    * This method verifies if code isn't already in the array of products
    *
    * @returns {boolean} True if code exists already, False if is new.
    */
    const productCodes = this.products.map(product => product.code)
    return productCodes.includes(code)
  }

  #registerProduct(title, description, code, price, status, stock, category, thumbnails) {
    /**
    * This method verifies if code exists, if not pushes the object to the array.
    * Assigns automatically incremental ID.
    *
    * @throws {Promise<Token>} If code already exists, rejects the promise.
    */

    if (this.#codeExists(code)) {
      return Promise.reject("Code already exists.")
    }

    const ID_LENGHT = 8
    let id = uid(ID_LENGHT)

    this.products.push({
      id: id,
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    })
  }

  // Promise methods
  #writeProductsToFile() {
    /**
    * This method writes the stringifies the array and writes it to the file in path
    *
    * @returns {Promise<Token>} Method returns chain of promises
    * @throws {Promise<Token>} If something fails, promise is rejected
    */
    return fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8')
      .then(() => { return Promise.resolve(`File was written with ${this.products.length} items.`) })
      .catch((e) => { return Promise.reject(`File couldn't be saved`) })
  }

  #readProductsFromFile() {
    /**
    * This method reads the file, parse the JSON content and loads the products array
    *
    * @returns {Promise<Token>} Method returns chain of promises
    * @throws {Promise<Token>} If something fails, promise is rejected
    */
    return fs.promises.readFile(this.path, 'utf-8')
      .then(data => { return JSON.parse(data) })
      .then(parsedData => this.products = parsedData)
      .catch(e => { return Promise.reject(`File couldn't be read ${e}`) })
  }
}

export default ProductManager