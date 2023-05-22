import { Router } from 'express'
import ProductManager from '../ProductManager.js'

const pm = new ProductManager("./src/JSON/products.json")

const router = Router()

router.get("/", async (req, res) => {
    /**
    * GET /api/products/<?limit=X>
    * @summary Takes limit query paramsand returns sliced products array or full array if no limit is established
    * @return {object} 200 - success response - products object with products array
    * @throws {object} 400 - failed response - error object with message
    */
    let productsArray = []
    try {
        productsArray = await pm.getProducts()
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
    if (!req.query.limit || isNaN(req.query.limit)) {
        return res.status(200).send({ "products": productsArray })
    }
    let limit = req.query.limit
    let slicedArray = productsArray.slice(0, limit)
    return res.status(200).send({ "products": slicedArray })
})

router.get("/:id", async (req, res) => {
    /**
    * GET /api/products/id
    * @summary Takes id param and product object
    * @return {object} 200 - success response - product object
    * @throws {object} 400 - failed response - error object with message
    */
    try {
        const id = req.params.id
        const product = await pm.getProductById(id)
        return res.status(200).send(product)
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.post("/", async (req, res) => {
    /**
    * POST /api/products/
    * @summary Takes product object in body, validates fields and types, writes in products array and file
    * @return {object} 200 - success response - info object with file size message
    * @throws {object} 400 - failed response - error object with message
    */
    let fieldsCondition = req.body.title && req.body.description && req.body.code && req.body.price && req.body.status && req.body.stock && req.body.category
    if (!fieldsCondition) {
        return res.status(400).send({ error: "Incomplete fields: title, description, code, price, status, stock, category" })
    }

    let typeCondition = typeof req.body.title == "string" && typeof req.body.description == "string" && typeof req.body.code == "string" && typeof req.body.price == "number" && typeof req.body.status == "boolean" && typeof req.body.stock == "number" && typeof req.body.category == "string"
    if (!typeCondition) {
        return res.status(400).send({ error: "Types not compatible: title (string), description (string), code (string), price (number), status (boolean), stock (number), category (string)" })
    }

    let thumbnails = req.body.thumbnails ?? ["placeholder.jpg"]

    const { title, description, code, price, status, stock, category } = req.body

    try {
        const pmResponse = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails)
        return res.status(200).send({ "info": pmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.put("/:id", async (req, res) => {
    /**
    * PUT /api/products/id
    * @summary Takes product object in body to update, validates fields and types, updates specified product
    * @return {object} 200 - success response - info object with id of updated product
    * @throws {object} 400 - failed response - error object with message
    */
    const prototypeObject = {
        title: "string",
        description: "string",
        code: "string",
        price: "number",
        status: "boolean",
        stock: "number",
        category: "string",
        thumbnails: "object",
    }

    for (let key of Object.keys(req.body)) {
        if (!(key in prototypeObject)) {
            return res.status(400).send({ error: `Can't update unknown parameter ${key}` })
        }
    }

    Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] != prototypeObject[key]) {
            return res.status(400).send({ error: `Can't update uncompatible type ${key} must be ${prototypeObject[key]}` })
        }
    })

    try {
        const id = req.params.id
        const pmResponse = await pm.updateProduct(id, req.body)
        return res.status(200).send({ "info": pmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.delete("/:id", async (req, res) => {
    /**
    * DELETE /api/products/id
    * @summary Deletes product specified by id param
    * @return {object} 200 - success response - info object with id of deleted product
    * @throws {object} 400 - failed response - error object with message
    */
    try {
        const id = req.params.id
        const pmResponse = await pm.deleteProduct(id)
        return res.status(200).send({ "info": pmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})


export default router;