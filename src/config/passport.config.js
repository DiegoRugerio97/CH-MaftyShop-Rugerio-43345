import passport from 'passport'
import local from 'passport-local'
import { userModel } from '../DAOs/models/users.model.js'
import { createHash, isPasswordValid } from '../utils.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy

export const initializePassportLocal = () => {

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
                return done('Error creating user ' + error)
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

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'XXXXXXXXXX',
            clientSecret: 'XXXXXXXXXXXXXXX',
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile._json.email });
                if (!user) {
                    let newUser = {
                        first_name: profile.username,
                        last_name: '',
                        email: profile.profileUrl,
                        age: 100,
                        password: '',
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

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id).exec()
        done(null, user)
    })

}

