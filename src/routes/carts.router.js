import { Router } from 'express'
import CartManager from '../CartManager.js'

const cm = new CartManager("./src/JSON/cart.json")

const router = Router()

router.post("/", async (req, res) => {
    /**
    * POST /api/carts/
    * @summary Creates empty cart in array with autogenerated id.
    * @return {object} 200 - success response - info object with size of carts array
    * @throws {object} 400 - failed response - error object with message
    */
    try {
        const cmResponse = await cm.createNewCart()
        res.status(200).send({ "info": cmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.get("/:id", async (req, res) => {
    /**
    * GET /api/carts/id
    * @summary Takes id params and returns products property of specified cart
    * @return {object} 200 - success response - cartProducts object with products property
    * @throws {object} 400 - failed response - error object with message
    */
    try {
        const id = req.params.id
        const products = await cm.getCartProductsById(id)
        return res.status(200).send({ "cartProducts": products })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    /**
    * POST /api/carts/cid/products/pid
    * @summary Takes cid and pid params and adds specified product to the specified cart
    * @return {object} 200 - success response - info object with cid, pid message
    * @throws {object} 400 - failed response - error object with message
    */

    try {
        const cid = req.params.cid
        const pid = req.params.pid
        // TEMP - FROM CH REQUIREMENTS
        const QUANTITY_TO_ADD = 1
        // const quantityToAdd = req.body.quantityToAdd
        const cmResponse = await cm.addProductToCart(cid, pid, QUANTITY_TO_ADD)
        return res.status(200).send({ "info": cmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.delete("/:id", async (req, res) => {
    /**
    * DELETE /api/carts/id
    * @summary Takes id and deletes the specified cart if it exists
    * @return {object} 200 - success response - info object id of deleted cart
    * @throws {object} 400 - failed response - error object with message
    */

    try {
        const id = req.params.id
        const cmResponse = await cm.deleteCart(id)
        return res.status(200).send({ "info": cmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    /**
    * DELETE /api/carts/cid/products/pid
    * @summary Takes cid and pid params deletes product from specified cart
    * @return {object} 200 - success response - info object pid message
    * @throws {object} 400 - failed response - error object with message
    */

    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cmResponse = await cm.deleteProductFromCart(cid, pid)
        return res.status(200).send({ "info": cmResponse })
    }
    catch (error) {
        return res.status(400).send({ "error": error })
    }
})

export default router;
