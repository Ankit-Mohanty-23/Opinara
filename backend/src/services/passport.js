import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Users from "../models/user.model.js";

export default function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:5000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.[0]?.value || profile._json?.email;

          if (!email) {
            return done(new Error("Email not provided by Google"), null);
          }

          const fullname =
            profile.displayName || profile._json?.name || "No Name";

          const avatarUrl =
            profile.photos?.[0]?.value || profile._json?.picture || "";

          let user = await Users.findOne({ email });

          // User exists → attach googleId if missing
          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // New user
          user = await Users.create({
            googleId: profile.id,
            email,
            fullname,
            avatar: {
              type: "image",
              url: avatarUrl,
              public_id: "",
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
