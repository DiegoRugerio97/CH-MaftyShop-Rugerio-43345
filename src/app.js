import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const pm = new ProductManager("./src/JSON/products.json")

app.use(express.urlencoded({extended:true}))

// Documentation (?)
app.get("/", async (req, res) => {
    let message = `/products - Return complete array of products
    /products?limit=X - Return X elements of products
    /products/<ID> - Return the product with specified ID`
    res.send(message)
})

// /products - Entire array
// /products?limit=X - X elements
app.get("/products", async (req, res) => {
    let productsArray = []
    try {
        productsArray = await pm.getProducts()
    }
    catch (error) {
        return res.send({ "error": error })
    }
    if (!req.query.limit || isNaN(req.query.limit)) {
        return res.send({ "products": productsArray })
    }
    let limit = req.query.limit
    let slicedArray = productsArray.slice(0, limit)
    return res.send({ "products": slicedArray })
})

// /products/<ID>
app.get("/products/:pId", async (req, res) => {
    try {
        const id = parseInt(req.params.pId)
        const product = await pm.getProductById(id)
        return res.send(product)
    }
    catch (error) {
        return res.send({ "error": error })
    }
})

const PORT = 8080
app.listen(PORT, () => console.log("Servidor en puerto 8080"))

// PROMESAS
// app.get("/productsP", (req, res) => {
//     if (!req.query.limit) {
//         pm.getProducts()
//             .then((productsArray) => res.send({ "products": productsArray }))
//             .catch(error => res.send({ "error": error }))
//     }
//     else {
//         let limit = req.query.limit
//         pm.getProducts()
//             .then((productsArray) => res.send({ "products": productsArray.slice(0, limit) }))
//             .catch(error => res.send({ "error": error }))
//     }
// })

// app.get("/productsP/:pId", (req, res) => {
//     const id = parseInt(req.params.pId)
//     pm.getProductById(id)
//         .then((product) => res.send(product))
//         .catch(error => res.send({ "error": error }))
// })