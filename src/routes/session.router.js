import { Router } from "express"
import passport from "passport"

const router = Router();

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister' }), async (req, res) => {
  res.status(200).send({ status: "success", message: "User registered succesfully!" })
})

router.get("/failRegister", async (req, res) => {
  res.status(409).send({ status: "error", message: "User already exists!" })
})

router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin' }), async (req, res) => {
  if (!req.user) return res.status(401).send()

  let user = req.user

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
      res.status(200).send({ status: "success", payload: user })
    }
  })
});

router.get("/failLogin", async (req, res) => {
  res.status(401).send()
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
  req.session.user = req.user
  res.redirect('/')
})


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