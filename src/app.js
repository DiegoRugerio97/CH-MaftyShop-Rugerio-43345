import express from 'express'
import productRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/products', productRouter)
app.use('/carts', cartRouter)


// Documentation (?)
app.get("/", async (req, res) => {
    let message = `/products - Return complete array of products
    /products?limit=X - Return X elements of products
    /products/<ID> - Return the product with specified ID`
    res.send(message)
})



const PORT = 8080
app.listen(PORT, () => console.log("Servidor en puerto 8080"))

