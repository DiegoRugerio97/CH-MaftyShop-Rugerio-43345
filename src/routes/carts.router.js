import { Router } from 'express'
import CartManager from '../DAOs/CartManager.js'

const cm = new CartManager()

const router = Router()

router.get("/", async (req, res) => {
    /**
    * GET /api/carts/allCarts Returns all carts
    */
    try {
        const response = await cm.getAllCarts()
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.get("/:id", async (req, res) => {
    /**
    * GET /api/carts/id Takes id params and returns products of specified cart
    */
    try {
        const id = req.params.id
        const cartProducts = await cm.getCartById(id)
        return res.status(200).send({ cartProducts: cartProducts })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    /**
    * POST /api/carts/cid/products/pid Takes cid and pid params and adds specified product to the specified cart
    */
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantityToAdd = req.body.quantityToAdd
        const response = await cm.addProductToCart(cid, pid, quantityToAdd)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.post("/", async (req, res) => {
    /**
    * POST /api/carts/ Creates empty cart in collection.
    */
    try {
        const response = await cm.createNewCart()
        res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.put("/:cid", async (req, res) => {
    /**
    * PUT /api/carts/cid Takes cid and updates/overwrites products array
    */
    try {
        const cid = req.params.cid
        const productsArray = req.body.products
        const response = await cm.updateCart(cid, productsArray)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    /**
    * PUT /api/carts/cid/products/pid Takes cid and pid params updates quantity of the product
    */
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantityToSet = req.body.quantityToSet
        const response = await cm.updateQuantity(cid, pid, quantityToSet)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.delete("/:cid", async (req, res) => {
    /**
    * DELETE /api/carts/cid Takes id and deletes the specified cart products
    */
    try {
        const cid = req.params.cid
        const response = await cm.deleteCart(cid)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    /**
    * DELETE /api/carts/cid/products/pid Takes cid and pid params deletes product from specified cart
    */

    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const response = await cm.deleteProductFromCart(cid, pid)
        return res.status(200).send({ response })
    }
    catch (error) {
        return res.status(400).send({ error })
    }
})

export default router;
