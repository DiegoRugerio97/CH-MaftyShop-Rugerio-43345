import { Router } from 'express'
import ProductManager from '../dao/mongoManager/ProductManager.js'
import { sanitizeQueryParams, linkBuilder } from '../utils.js'

const pm = new ProductManager()

const router = Router()


router.get("/", async (req, res) => {
    /**
    * GET /api/products/ - Returns list of products, added pagination and advanced queries
    */

    const queryParameters = sanitizeQueryParams(req.query)
    const { limit, pageNumber, sort, queryField, queryVal } = queryParameters

    try {
        // Get products from manager, using sanitized query params
        const products = await pm.getProducts(limit, pageNumber, sort, queryField, queryVal)
        // Get relevant information from paginate response
        let { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products
        // Create next and prev links
        const { prevLink, nextLink } = linkBuilder("api/products",queryParameters, hasNextPage, hasPrevPage, page)
        // Create the response object
        const response = { status: "success", payload: docs, totalPages: totalPages, prevPage: prevPage, nextPage: nextPage, page: page, hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, prevLink: prevLink, nextLink: nextLink }
        // Send the response
        res.send(response);
    }
    catch (error) {
        res.send({ status: "error", error: error });
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
        socketServer.emit("product_update_add", { id: response._id.toString(), title: response.title, description: response.description, code: response.code, price: response.price, stock: response.stock, thumbnails: response.thumbnails })
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
        socketServer.emit("product_update_remove", response._id.toString())

        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})


export default router;