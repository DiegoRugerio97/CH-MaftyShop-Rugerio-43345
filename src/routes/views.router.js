import { Router } from 'express'
import CartManager from '../CartManager.js'
import ProductManager from '../ProductManager.js'

// const cm = new CartManager("./src/JSON/cart.json")
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
        res.status(200).render('home', {products})
    }
    catch(error){
        res.status(404).send({'error' : error})
    }
    
})


export default router;
