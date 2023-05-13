import express from 'express'

const app = express()

app.get("/saludo",(req, res) => {
    res.send("Hola")
})

app.listen(8000, ()=>console.log("Servidor en puerto 8000"))