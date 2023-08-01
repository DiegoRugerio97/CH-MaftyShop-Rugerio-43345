import { Router } from 'express'
// Managers
import ProductManager from '../dao/mongoManager/ProductManager.js'
import MessageManager from '../dao/mongoManager/MessageManager.js'
import CartManager from '../dao/mongoManager/CartManager.js'
// Utils
import { sanitizeQueryParams, linkBuilder } from '../utils.js'
// Passport
import passport from 'passport'

// Instances of managers
const pm = new ProductManager()
const mm = new MessageManager()
const cm = new CartManager()

const router = Router()

router.get('/', passport.authenticate('current', { session: false, failureRedirect:'/login' }), async (req, res) => {
    /**
    * GET / Renders an HTML page using Handlebars with list of products
    */

    const queryParameters = sanitizeQueryParams(req.query)
    const { limit, pageNumber, sort, queryField, queryVal } = queryParameters
    try {
        const response = await pm.getProducts(limit, pageNumber, sort, queryField, queryVal)
        let { docs, page, hasPrevPage, hasNextPage, totalPages } = response
        if (pageNumber > totalPages) {
            throw `Page ${pageNumber} doesn't exist`
        }
        const { prevLink, nextLink } = linkBuilder("", queryParameters, hasNextPage, hasPrevPage, page)
        res.status(200).render('products', { user: req.user.user, docs: docs, prevLink: prevLink, nextLink: nextLink, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage })
    }
    catch (error) {
        res.status(404).render('error', { error })
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
        res.status(404).render('error', { error })
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
        res.status(404).render('error', { error })
    }
})

router.get('/carts/:cid', async (req, res) => {
    /**
    * GET /carts/:ciid Renders an HTML page using Handlebars with list of products in Cart
    */
    try {
        const cid = req.params.cid
        const cartProducts = await cm.getCartById(cid)
        return res.status(200).render("cart", { cartProducts })
    }
    catch (error) {
        res.status(404).render('error', { error })
    }
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.get('/login', (req, res) => {
    return res.render('login')
})




export default router;
