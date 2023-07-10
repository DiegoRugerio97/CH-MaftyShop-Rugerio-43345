import passport from "passport"
import local from 'passport-local'
import { userModel } from "../DAOs/models/users.model.js"
import { createHash, isPasswordValid } from "../utils.js"

const LocalStrategy = local.Strategy
const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const userExists = await userModel.findOne({ email }).lean().exec()

                if (userExists)
                    return done(null, false)

                const hashedPassword = createHash(password)
                let result = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword
                })
                return done(null, result)
            }
            catch (error) {
                return done("Error creating user " + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, async (username, password, done) => {
            try {
                let user = await userModel.findOne({ email: username }).lean().exec()
                if (!user) return done(null, false)

                let validCredentials = isPasswordValid(user, password)
                if (!validCredentials) return done(null, false)

                return done(null, user)
            }
            catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id).exec()
        done(null, user)
    })

}

export default initializePassport