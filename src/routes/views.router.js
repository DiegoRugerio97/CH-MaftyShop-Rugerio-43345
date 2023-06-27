import { Router } from 'express'
import ProductManager from '../DAOs/ProductManager.js'
import MessageManager from '../DAOs/MessageManager.js'
import { sanitizeQueryParams, linkBuilder } from '../utils.js'
const pm = new ProductManager()
const mm = new MessageManager()

const router = Router()

router.get('/', async (req, res) => {
    /**
    * GET / Renders an HTML page using Handlebars with list of products
    */
    try {
        const LIMIT = 100
        const response = await pm.getProducts(LIMIT)
        const products = response.docs
        res.status(200).render('home', { products })
    }
    catch (error) {
        res.status(404).send({ 'error': error })
    }
})


router.get('/products', async (req, res) => {
    /**
    * GET / Renders an HTML page using Handlebars with list of products
    */
    const queryParameters = sanitizeQueryParams(req.query)
    const { limit, pageNumber, sort, queryField, queryVal } = queryParameters
    try {
        const response = await pm.getProducts(limit, pageNumber, sort, queryField, queryVal)
        let { docs, page, hasPrevPage, hasNextPage } = response
        const { prevLink, nextLink } = linkBuilder("products",queryParameters, hasNextPage, hasPrevPage, page)
        res.status(200).render('products', { docs: docs, prevLink: prevLink, nextLink: nextLink, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage })
    }
    catch (error) {
        res.status(404).send({ 'error': error })
    }
})


router.get('/realtimeproducts', async (req, res) => {
    /**
    * GET /realtimeproducts Renders an HTML page using Handlebars with list of products, connects to websocket
    */

    try {
        const LIMIT = 100
        const response = await pm.getProducts(LIMIT)
        const products = response.docs
        res.status(200).render('realTimeProducts', { products })
    }
    catch (error) {
        res.status(404).send({ error })
    }
})


router.get('/chat', async (req, res) => {
    /**
    * GET /chat Renders an HTML page using Handlebars with chat, connects to websocket
    */
    let messages = []
    try {
        messages = await mm.getMessages()
        res.status(200).render('chat', { messages })
    }
    catch (error) {
        res.status(404).send({ error })
    }

})


export default router;
