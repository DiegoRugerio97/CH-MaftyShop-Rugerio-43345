// Passport imports
import passport from 'passport'
import jwt from 'passport-jwt'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

// JWT strategy for authentication
export const initializePassportJWT = () => {
    passport.use(
        'current',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: 'maftySecret',
            },
            async (jwtPayload, done) => {
                try {
                    return done(null, jwtPayload)
                } catch (e) {
                    return done(e)
                }
            }
        )
    );
};


const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['userCookie'];
    }
    return token
};