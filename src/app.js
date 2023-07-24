// Express
import express from 'express'
import handlebars from 'express-handlebars'
// Socket.io
import { Server } from 'socket.io'
// Routes
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import sessionRouter from './routes/session.router.js'
// Mongo
import mongoose from 'mongoose'
// Misc
import __dirname from './utils.js'
import MessageManager from './DAOs/MessageManager.js'
// Passport
import passport from 'passport'
import { initializePassportJWT } from './config/jwt.passport.js'
import { initializePassportLocal } from './config/passport.config.js'
import cookieParser from 'cookie-parser'


// Initialize express
const app = express()
// Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
// Public resources
app.use(express.static(__dirname + '/public'))
// Mongo
const mongoURL = "mongodb+srv://diegorugerioc97:qWc3YfaglRahEPsz@mafty-shop.qmwjsfz.mongodb.net/?retryWrites=true&w=majority"
const db = "ecommerce"
mongoose.connect(mongoURL, { dbName: db })
//Config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Sessions and Passport

app.use(cookieParser())
initializePassportJWT()
initializePassportLocal()
app.use(passport.initialize())


// Routes
app.use('/api/sessions', sessionRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)

// Initiate the server
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log("Listening on port 8080"))

// Socket
// Chat and realTimeProducts
const socketServer = new Server(httpServer)
app.set('io', socketServer)
const mm = new MessageManager()

const handler = (socket) => {
    console.log(`Client connected to app ${socket.id}`)

    socket.on("message", async (data) => {
        const { user, message } = data
        await mm.createMessage(user, message);
        socketServer.emit("print", data);
    });

    socket.on('authenticatedUser', (data) => {
        socket.broadcast.emit('newUserAlert', data)
    })
}
socketServer.on('connection', handler)