// Express
import express from 'express'
import handlebars from 'express-handlebars'
// Socket.io
import { Server } from 'socket.io'
// Routes
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
// Mongo
import mongoose, { mongo } from 'mongoose'
// Misc
import __dirname from './utils.js'

const app = express()

//Requests
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine','handlebars')
// Public resources
app.use(express.static(__dirname+'/public'))
// Routes
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)
// Mongo
const mongoURL = "mongodb+srv://diegorugerioc97:qWc3YfaglRahEPsz@mafty-shop.qmwjsfz.mongodb.net/?retryWrites=true&w=majority"
const db = "ecommerce"
mongoose.connect(mongoURL,{dbName : db})

// Initiate the server
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log("Listening on port 8080"))

// Socket
const socketServer = new Server(httpServer)
app.set('io',socketServer)

