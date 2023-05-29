import { Router } from 'express'
import CartManager from '../CartManager.js'
import ProductManager from '../ProductManager.js'

const pm = new ProductManager("./src/JSON/products.json")

const router = Router()

router.get('/', async (req, res) => {
    /**
    * GET /
    * @summary Renders an HTML page using Handlebars with list of products
    * @return {void} 200 - success response - loads HTML
    */
    try {
        const products = await pm.getProducts()
        res.status(200).render('home', { products })
    }
    catch (error) {
        res.status(404).send({ 'error': error })
    }
})


router.get('/realtimeproducts', async (req, res) => {
    /**
    * GET /realtimeproducts
    * @summary Renders an HTML page using Handlebars with list of products, connects to websocket
    * @return {void} 200 - success response - loads HTML
    */
    const app = req.app
    let socketServer = app.get("io")
    socketServer.on('connection', socket => {
        console.log("Cliente conectado")
    })
    try {
        const products = await pm.getProducts()
        res.status(200).render('realTimeProducts',{ products })
    }
    catch (error) {
        res.status(404).send({ 'error': error })
    }
})


export default router;
