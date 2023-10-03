//Call Express Api
import express from "express";
import session from "express-session";
import genuuid from "uuid/v4";
const app = express();
app.use(
  session({
    name: "SessionCookie",
    genid: function (req) {
      console.log("session id created");
      return genuuid();
    },
    secret: "This is Secret!",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, expires: 60000 },
  })
);

// Get function in which send session as routes.
app.get("/session", function (req, res, next) {
  if (req.session.views) {
    // Increment the number of views.
    req.session.views++;

    // Session will expires after 1 min
    // of in activity
    res.write(
      "<p> Session expires after 1 min of activity:" +
        req.session.cookie.expires +
        "</p>"
    );

    res.end();
  } else {
    req.session.views = 1;
    res.end(" New session is started");
  }
});
//the server object listens on port 3000.
app.listen(3000, function () {
  console.log("Express Started on PORT 3000");
});
