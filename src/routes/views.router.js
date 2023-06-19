import { Router } from 'express'
import ProductManager from '../DAOs/ProductManager.js'
import MessageManager from '../DAOs/MessageManager.js'

const pm = new ProductManager()
const mm = new MessageManager()

const router = Router()

router.get('/', async (req, res) => {
    /**
    * GET / Renders an HTML page using Handlebars with list of products
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
    * GET /realtimeproducts Renders an HTML page using Handlebars with list of products, connects to websocket
    */
    
    try {
        const products = await pm.getProducts()
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
