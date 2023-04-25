class ProductManager {
    constructor() {
      this.products = [];
    }
    
    addProduct(title, description, price, thumbnail, code, stock){
      if(arguments.length !== 6){
        console.log("ERROR: Necessary fields: title, description, price, thumbnail, code, stock")
        return
      }

      if (this.#codeExists(code)){
        console.log("ERROR: Code already exists.")
        return
      }

      let id = 1
      let isEmpty = this.products.length == 0
      if (!isEmpty){
        let previousID = this.products[this.products.length-1].id
        id = previousID + 1
      }

      this.products.push({
        title : title,
        description : description,
        thumbnail : thumbnail,
        price : price,
        thumbnail : thumbnail,
        code : code,
        stock : stock,
        id:id
      })
    }

    getProductById(id){
      return this.products.find(product=>product.id === id) ?? "ERROR: Product not found."
    }

    getProducts(){
      return this.products
    }

    #codeExists(code){
      const productCodes = this.products.map(product=> product.code)
      return productCodes.includes(code)
    }
  }

// ProductManager instance
const PM = new ProductManager()
// Empty array
console.log(PM.getProducts())
// New product, id 1
PM.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// Array with one object
console.log(PM.getProducts())
// Adding product with same code, error message
PM.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
// Returns one object, id 1
console.log(PM.getProductById(1))
// Another product is added, id 2
PM.addProduct("Prueba 2", "Este es un producto prueba", 200, "Sin imagen", "cba321", 25)
// Array with two objects
console.log(PM.getProducts())
// Search for an inexistent id, error message
console.log(PM.getProductById(1234))
// Third product is added, id 3
PM.addProduct("Prueba 3", "Este es un producto prueba", 200, "Sin imagen", "xd", 25)
// Array with 3 objects
console.log(PM.getProducts())
// Trying to add a product with missing parameter stock, would add undefined but it's validated, error message
PM.addProduct("Prueba 3", "Este es un producto prueba", 200, "Sin imagen", "xd")