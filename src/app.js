// Express
import express from 'express'
import handlebars from 'express-handlebars'
// Routes
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
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

// Initiate the server
const PORT = 8080
app.listen(PORT, () => console.log("Servidor en puerto 8080"))

