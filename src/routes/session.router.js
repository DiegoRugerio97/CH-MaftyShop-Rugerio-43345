import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister', session: false }), async (req, res) => {
  res.status(200).send({ status: 'success', message: 'User registered succesfully!' })
})

router.get('/failRegister', async (req, res) => {
  res.status(409).send({ status: 'error', message: 'User already exists!' })
})

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

router.get('/failLogin', async (req, res) => {
  res.status(401).send()
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
  req.session.user = req.user
  res.redirect('/')
})


router.get('/logout', async (req, res) => {
  res.clearCookie('userCookie')
  res.redirect("/login")
});

router.get('/current', passport.authenticate('current', { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

export default router