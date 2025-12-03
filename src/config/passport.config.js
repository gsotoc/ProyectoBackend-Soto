import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { JWT_SECRET } from "./config.js";

const LocalStrategy = local.Strategy;
const JwtStrategy = jwt.Strategy;

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  }
  return token;
};

export const initializePassport = () => {

  // ---------- REGISTER ----------
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "USER_EXISTS" });
          }

          const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: password
          });
          
          return done(null, newUser);
        } catch (error) {
          
          console.log("❌ ERROR REGISTER:", error);
          return done(error);
        }
      }
    )
  );

  // ---------- LOGIN ----------
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) return done(null, false);

          const isValid = bcrypt.compareSync(password, user.password);
          if (!isValid) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // ---------- JWT ----------
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]), // ✅ CLAVE
        secretOrKey: JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id);
          if (!user) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
