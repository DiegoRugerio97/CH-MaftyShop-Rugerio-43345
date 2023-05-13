import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()
const pm = new ProductManager("./src/JSON/products.json")

app.get("/products", async (req, res) => {
    let productsArray = []
    try {
        productsArray = await pm.getProducts()
    }
    catch (error) {
        res.send(error)
    }
    if (!req.query.limit) {
        res.send({"products": productsArray})
    }
    let limit = req.query.limit
    let slicedArray = productsArray.slice(0,limit)
    res.send({"products": slicedArray})
})

app.get("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid)
        const product = await pm.getProductById(id)
        res.send(product)
    }
    catch (error) {
        res.send(error)
    }
})


app.listen(8000, () => console.log("Servidor en puerto 8000"))

// app.get("/productsP", (req, res) => {
//     pm.getProducts()
//         .then((productsArray) => res.send({ "products": productsArray }))
// })
