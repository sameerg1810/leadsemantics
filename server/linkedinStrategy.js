import passport from "passport";

class LinkedInStrategy extends passport.Strategy {
  constructor(options) {
    super(options);
  }

  authenticate(accessToken, refreshToken, profile) {
    // Get the user's id from LinkedIn
    const userId = profile.id;

    // Check if the user exists in your database
    const user = user.findOne({ userId });

    // If the user exists, return the user object
    if (user) {
      return user;
    } else {
      // If the user doesn't exist, create a new user object and return it
      const newUser = new user({
        userId,
        email: profile.emailAddress,
        name: profile.name,
      });
      newUser.save();
      return newUser;
    }
  }
  name = "linkedin";
}

export default LinkedInStrategy;
