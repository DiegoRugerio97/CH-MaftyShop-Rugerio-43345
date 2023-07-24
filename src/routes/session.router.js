// Router
import { Router } from 'express'
// Passport
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router();

// Register
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister', session: false }), async (req, res) => {
  res.status(200).send({ status: 'success', message: 'User registered succesfully.' })
})

// Login
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/failLogin', session: false }), async (req, res) => {

  if (!req.user) return res.status(401).send()

  let user = req.user
  let token = jwt.sign({ user }, 'maftySecret', {
    expiresIn: '24h',
  })

  res
    .cookie('userCookie', token, { httpOnly: true })
    .send({ status: 'success' })
})

// Github login
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login', session: false }), async (req, res) => {
  let user = req.user
  let token = jwt.sign({ user }, 'maftySecret', {
    expiresIn: '24h',
  })

  res
    .cookie('userCookie', token, { httpOnly: true })
    .redirect('/')
})

// User information with JWT 

router.get('/current', passport.authenticate('current', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

// Logout
// Clears cookie
router.get('/logout', async (req, res) => {
  res.clearCookie('userCookie')
  res.redirect("/login")
})


// Error routes

router.get('/failLogin', async (req, res) => {
  res.status(401).send()
})

router.get('/failRegister', async (req, res) => {
  res.status(409).send({ status: 'error', message: 'User already exists.' })
})

export default router