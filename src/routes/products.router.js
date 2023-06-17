import { Router } from 'express'
import ProductManager from '../DAOs/ProductManager.js'

const pm = new ProductManager()

const router = Router()


router.get("/", async (req, res) => {
    /**
    * GET /api/products/ - Returns list of products, optional limit query param
    */
    try {
        if (!req.query.limit || isNaN(req.query.limit)) {
            let products = await pm.getProducts()
            return res.status(200).send({ products })
        }
        let limit = req.query.limit
        let products = await pm.getProducts(limit)
        return res.status(200).send({ products })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.get("/:id", async (req, res) => {
    /**
    * GET /api/products/<id> - Returns product with the corresponding id
    */
    let id = req.params.id
    try {
        const product = await pm.getProductById(id)
        return res.status(200).send(product)
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.post("/", async (req, res) => {
    /**
    * POST /api/products/ - Returns newly created product
    */
    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    try {
        const response = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)
        // Socket emit
        const app = req.app
        const socketServer = app.get('io')
        socketServer.emit("product_update_add", { id: response.id, title: title, description: description, code: code, price: price, stock: stock, thumbnails: thumbnails })
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.put("/:id", async (req, res) => {
    /**
    * PUT /api/products/<id> - Returns updated product
    */
    try {
        const id = req.params.id
        const response = await pm.updateProduct(id, req.body)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.delete("/:id", async (req, res) => {
    /**
    * DELETE /api/products/<id> - Returns deleted product
    */
    try {
        const id = req.params.id
        const response = await pm.deleteProduct(id)

        // Socket emit
        const app = req.app
        const socketServer = app.get('io')
        socketServer.emit("product_update_remove", response.__id)

        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})
export default router;