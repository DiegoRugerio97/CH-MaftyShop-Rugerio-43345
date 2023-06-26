import { Router } from 'express'
import ProductManager from '../DAOs/ProductManager.js'
import { sanitizeFilter } from 'mongoose'

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
        const { prevLink, nextLink } = linkBuilder(queryParameters, hasNextPage, hasPrevPage, page)
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

const linkBuilder = (parameters, hasNextPage, hasPrevPage, page) => {
    const ROOT_URL = `http://localhost:8080/api/products?limit=${parameters.limit}`
    let finalURLString = ROOT_URL
    if (parameters.sort) {
        finalURLString += `&sort=${parameters.sort}`
    }
    if (parameters.queryField) {
        finalURLString += `&queryField=${parameters.queryField}`
    }
    if (parameters.queryVal) {
        finalURLString += `&queryField=${parameters.queryVal}`
    }

    const links = { prevLink: null, nextLink: null }
    if (hasPrevPage) {
        let prevPage = page - 1
        let prevPageURL = finalURLString
        prevPageURL += `&page=${prevPage}`
        links.prevLink = prevPageURL
    }
    if (hasNextPage) {
        let nextPage = page + 1
        let nextPageURL = finalURLString
        nextPageURL += `&page=${nextPage}`
        links.nextLink = nextPageURL
    }
    return links
}

const sanitizeQueryParams = (parameters) => {

    const queryParameters = {}
    // limit
    let limitIsValid = parameters.limit && !isNaN(parameters.limit)
    if (limitIsValid) {
        queryParameters.limit = parseInt(parameters.limit)
    }
    else {
        const DEFAULT_LIMIT = 10
        queryParameters.limit = DEFAULT_LIMIT
    }
    // page
    let pageIsValid = parameters.page && !isNaN(parameters.page)
    if (pageIsValid) {
        queryParameters.pageNumber = parseInt(parameters.page)
    }
    else {
        const DEFAULT_PAGE = 1
        queryParameters.pageNumber = DEFAULT_PAGE
    }
    // sort
    let sortIsValid = parameters.sort && (parameters.sort == "asc" || parameters.sort == "desc")
    if (sortIsValid) {
        queryParameters.sort = parameters.sort
    }
    else {
        queryParameters.sort = null
    }
    // query
    let queryIsValid = parameters.queryField && parameters.queryField != "" && parameters.queryVal && parameters.queryVal != ""
    if (queryIsValid) {
        queryParameters.queryField = parameters.queryField
        queryParameters.queryVal = parameters.queryVal
    }
    else {
        queryParameters.queryField = null
        queryParameters.queryVal = null
    }

    return queryParameters
}

export default router;