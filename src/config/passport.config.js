// ENV
import config from './config.js'
// Passport imports
import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
// Models
import { userModel } from '../DAOs/models/users.model.js'
import { cartModel } from '../DAOs/models/cart.model.js'
// Utils
import { createHash, isPasswordValid } from '../utils.js'

const LocalStrategy = local.Strategy

export const initializePassportLocal = () => {
    // Register
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const userExists = await userModel.findOne({ email }).lean().exec()

                if (userExists)
                    return done(null, false)

                const hashedPassword = createHash(password)

                const response = await cartModel.create({})

                let result = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    cart: response._id
                })
                return done(null, result)
            }
            catch (error) {
                return done('Error creating user ' + error)
            }
        }
    ))
    // Login
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
    // Github
    passport.use('github', new GitHubStrategy(
        {
            clientID: config.clientID,
            clientSecret: config.clientID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.profileUrl }).exec()
                if (!user) {
                    const response = await cartModel.create({})
                    let newUser = {
                        first_name: profile.username,
                        last_name: '',
                        email: profile.profileUrl,
                        age: 18,
                        password: '',
                        cart: response._id
                    };
                    let result = await userModel.create(newUser);
                    done(null, result);
                }
                else {
                    done(null, user);
                }
            }
            catch (error) {
                done(error)
            }
        }
    )
    );

    // Serialization
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id).exec()
        done(null, user)
    })

}

