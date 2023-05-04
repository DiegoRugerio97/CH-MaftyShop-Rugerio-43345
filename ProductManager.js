class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  // Main methods
  addProduct(title, description, price, thumbnail, code, stock) {
    if (arguments.length !== 6) {
      return Promise.reject("ERROR: Necessary fields: title, description, price, thumbnail, code, stock")
    }

    this.#readProductsFromFile()
      .then(() => this.#registerProduct(title, description, price, thumbnail, code, stock))
      .then(() => this.#writeProductsToFile())
      .catch(e => console.log(e))
  }

  getProductById(id) {
    return this.#readProductsFromFile()
      .then(() => { return this.products.find(product => product.id === id) ?? Promise.reject("ERROR: Product not found.") })
  }

  getProducts() {
    return this.#readProductsFromFile().
      then(() => { return this.products ?? Promise.reject("ERROR: Could not load products.") })
  }

  deleteProduct(id) {
    this.#readProductsFromFile()
      .then(() => this.products.find(product => product.id === id) ?? Promise.reject("ERROR: Product not found."))
      .then(() => { return this.products.filter(product => product.id != id) })
      .then(filteredProducts => this.products = filteredProducts)
      .then(() => this.#writeProductsToFile())
      .then(() => console.log(`INFO: Product with ID: ${id} deleted`))
      .catch(e => console.log(e))
  }

  updateProduct(id, obj) {
    this.#readProductsFromFile()
      .then(() => {
        let productIndex = this.products.findIndex(product => product.id === id) 
        if (productIndex === -1) {
          return Promise.reject("ERROR: Product not found.")
        }
        return productIndex
      })
      .then((productIndex) => this.products[productIndex] = {...this.products[productIndex],...obj})
      .then(() => this.#writeProductsToFile())
      .catch(e => console.log(e))
  }
  // Utility methods
  #codeExists(code) {
    const productCodes = this.products.map(product => product.code)
    return productCodes.includes(code)
  }

  #registerProduct(title, description, price, thumbnail, code, stock) {

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
    return fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8')
      .then(() => console.log(`INFO: File was written with ${this.products.length} items.`))
      .catch((e) => { return Promise.reject(`ERROR: File couldn't be saved`) })
  }

  #readProductsFromFile() {
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
// PM.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "Code10", 25)

// Print products
// printPromise(PM.getProducts())
// Print product ID, change ID to test
// printPromise(PM.getProductById(7))
// PM.deleteProduct(4)

// Update
obj = {
  "title": "Producto actualizado",
  "description" : "Descripcion actualizada"
}
// PM.updateProduct(7, obj)
// printPromise(PM.getProductById(7))