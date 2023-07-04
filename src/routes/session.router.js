import { Router } from "express"
import { userModel } from "../DAOs/models/users.model.js"

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body
  const exist = await userModel.findOne({ email })

  if (exist)
    return res
      .status(400)
      .send({ status: "error", message: "User already registered!" })

  await userModel.create({
    first_name,
    last_name,
    email,
    age,
    password,
  })
  res.status(200).send({ status: "success", message: "User registered succesfully!" })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  let user = await userModel.findOne({ email: email, password: password })
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    user = {
      first_name: "Administrator",
      email: "adminCoder@coder.com",
      role: "Administrator"
    }
  }
  if (!user) return res.status(401).send()
  req.session.user = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    role: "User"
  };
  req.session.save(err => {
    if (err) {
      console.log(err)
    }
    else {
      res.status(200).send({ status: "success", message: req.session.user })
    }
  })

});

router.get("/logout", async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(505).render('error', { error })
    }
    else {
      res.redirect('/login')
    }
  })
});

export default router