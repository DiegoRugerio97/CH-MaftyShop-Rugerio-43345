import { Router } from 'express'
import ProductManager from '../DAOs/ProductManager.js'


const pm = new ProductManager()

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
    const app = req.app
    let socketServer = app.get("io")
    socketServer.on('connection', socket => {
        console.log("Cliente conectado")
    })
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
    const mensajes = []
    const app = req.app
    let socketServer = app.get("io")
    socketServer.on('connection', socket => {
        console.log(`Cliente conectado ${socket.id}`)

        socket.on("message", (data) => {
            console.log(data)
            mensajes.push(data);
            socketServer.emit("imprimir", mensajes);
        });

        socket.on('authenticatedUser', (data) => {
            socket.broadcast.emit('newUserAlert', data)
        })

    })
    try {
        res.status(200).render('chat')
    }
    catch (error) {
        res.status(404).send({ error })
    }
})


export default router;
