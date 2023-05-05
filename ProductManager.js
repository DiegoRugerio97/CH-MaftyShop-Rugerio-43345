
class ProductManager {
  /**
 * Creates a ProductManager instance, stores an array of products and a path to where the file will be read from/ written to.
 * @class
 * @param {string} path File storing path.
 */
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Main methods
  addProduct(title, description, price, thumbnail, code, stock) {
    /**
    * This method does reads from the file, adds the product to the array, and writes the file again to the specified file.
    *
    * @method addProduct
    * @memberof ProductManager
    * @instance
    * @async
    * @param {string} title Title of the product.
    * @param {string} description Description of the product.
    * @param {number} price Price of the product in MXN.
    * @param {string} thumbnail URL for the image of product.
    * @param {string} code Code of the product.
    * @param {number} stock Current stock for the product.
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} In case number of arguments is incorrect, rejects the promise.
    */
    if (arguments.length !== 6) {
      return Promise.reject("ERROR: Necessary fields: title, description, price, thumbnail, code, stock")
    }

    this.#readProductsFromFile()
      .then(() => this.#registerProduct(title, description, price, thumbnail, code, stock))
      .then(() => this.#writeProductsToFile())
      .catch(e => console.log(e))
  }

  getProductById(id) {
    /**
    * This method reads from the file and returns a single product object if it exists.
    *
    * @method getProductById
    * @memberof ProductManager
    * @instance
    * @async
    * @param {number} id ID of the product to retrieve.
    * @returns {Object} Returns the specified object.
    * @throws {Promise<Token>} In case ID doesn't exists, rejects the promise.
    */
    return this.#readProductsFromFile()
      .then(() => { return this.products.find(product => product.id === id) ?? Promise.reject("ERROR: Product not found.") })
  }

  getProducts() {
    /**
    * This method reads from the file and returns the entire array of products.
    *
    * @method getProducts
    * @memberof ProductManager
    * @instance
    * @async
    * @returns {Array} Returns the array of products.
    * @throws {Promise<Token>} In case number of arguments is incorrect, rejects the promise.
    */
    return this.#readProductsFromFile().
      then(() => { return this.products ?? Promise.reject("ERROR: Could not load products.") })
  }

  deleteProduct(id) {
    /**
    * This method reads from the file, deletes the specified product if it exists.
    *
    * @method deleteProduct
    * @memberof ProductManager
    * @instance
    * @async
    * @param {number} id ID of the product to delete.
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} In case ID doesn't exists, rejects the promise.
    */
    this.#readProductsFromFile()
      .then(() => this.products.find(product => product.id === id) ?? Promise.reject("ERROR: Product not found."))
      .then(() => { return this.products.filter(product => product.id != id) })
      .then(filteredProducts => this.products = filteredProducts)
      .then(() => this.#writeProductsToFile())
      .then(() => console.log(`INFO: Product with ID: ${id} deleted`))
      .catch(e => console.log(e))
  }

  updateProduct(id, obj) {
    /**
    * This method does reads from the file, retrieves the product to update and writes the array to the file.
    *
    * @method updateProduct
    * @memberof ProductManager
    * @instance
    * @async
    * @param {number} id ID of the product to update.
    * @param {Object} obj Object with the specified fields to update.
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} In case the ID doesn't exist, rejects the promise.
    */
    this.#readProductsFromFile()
      .then(() => {
        let productIndex = this.products.findIndex(product => product.id === id)
        if (productIndex === -1) {
          return Promise.reject("ERROR: Product not found.")
        }
        return productIndex
      })
      .then((productIndex) => this.products[productIndex] = { ...this.products[productIndex], ...obj })
      .then(() => this.#writeProductsToFile())
      .catch(e => console.log(e))
  }
  // Utility methods
  #codeExists(code) {
    /**
    * This method verifies if code isn't already in the array of products.
    *
    * @method codeExists
    * @memberof ProductManager
    * @instance
    * @param {string} code Code to verify.
    * @returns {boolean} True if code exists already, False if is new.
    */
    const productCodes = this.products.map(product => product.code)
    return productCodes.includes(code)
  }

  #registerProduct(title, description, price, thumbnail, code, stock) {
    /**
    * This method verifies if code exists, if not pushes the object to the array.
    * Assigns automatically incremental ID.
    *
    * @method registerProduct
    * @memberof ProductManager
    * @instance
    * @param {string} title Title of the product.
    * @param {string} description Description of the product.
    * @param {number} price Price of the product in MXN.
    * @param {string} thumbnail URL for the image of product.
    * @param {string} code Code of the product.
    * @param {number} stock Current stock for the product.
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} If code already exists, rejects the promise.
    */

    if (this.#codeExists(code)) {
      return Promise.reject("ERROR: Code already exists.")
    }

    let id = 1
    let isEmpty = this.products.length == 0
    if (!isEmpty) {
      let previousID = this.products[this.products.length - 1].id
      id = previousID + 1
    }

    this.products.push({
      title: title,
      description: description,
      thumbnail: thumbnail,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
      id: id
    })
  }

  // Promise methods
  #writeProductsToFile() {
    /**
    * This method writes the stringifies the array and writes it to the file in path.
    *
    * @method #writeProductsToFile
    * @memberof ProductManager
    * @instance
    * @async
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} If something fails, promise is rejected.
    */
    return fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8')
      .then(() => console.log(`INFO: File was written with ${this.products.length} items.`))
      .catch((e) => { return Promise.reject(`ERROR: File couldn't be saved`) })
  }

  #readProductsFromFile() {
    /**
    * This method reads the file, parse the JSON content and loads the products array.
    *
    * @method #readProductsFromFile
    * @memberof ProductManager
    * @instance
    * @async
    * @returns {void} Method doesn't return anything.
    * @throws {Promise<Token>} If something fails, promise is rejected.
    */
    return fs.promises.readFile(this.path, 'utf-8')
      .then(data => { return JSON.parse(data) })
      .then(parsedData => this.products = parsedData)
      .catch(e => { return Promise.reject(`ERROR: File couldn't be read`) })
  }
}

// Print promise results
const printPromise = (promise) => {
  promise
    .then(result => console.log(result))
    .catch(e => console.log(e))
}

const fs = require('fs')

// ProductManager instance
const PM = new ProductManager('./products.json')

// PLAYGROUND
// New product, change code to add
// Same code to test code error
// PM.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "Code9", 25)

// Print products
// printPromise(PM.getProducts())
// Print product ID, change ID to test
// printPromise(PM.getProductById(100))
// PM.deleteProduct(100)

// Update
obj = {
  "title": "Producto actualizado",
  "description": "Descripcion actualizada Stock 1000",
  "stock" : 1000
}
// PM.updateProduct(9, obj)
// printPromise(PM.getProductById(7))