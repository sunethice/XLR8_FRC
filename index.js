const express = require('express'); // importing express js library
const app = express(); /* create running express application, normally have only one application but can have several.
                          this set up configuration to listen requests on the port and navigate to handler to get response.
                        */
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const mongoose = require('mongoose');
require('./models/User');
require('./services/passport');

/*
====================================================================================================================================
                                                        Deployment checklist
====================================================================================================================================
1. Dynamic port binding - as done following to use port assigned to environmental variable
2. Specify node environment -  specify node version to tell heroku what version to use, this is specified in package.json
3. Specify start script - Instruct heroku what command to run to start the server.(Specify start command in package.json)
4. Create .gitignore file - to ignore transfer depndecncy files to heroku, instead let heroku mange all the dependecy files
                            by itself.
*/

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey] // to encrypt the cookie
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true });
const PORT = process.env.PORT || 5000; /* in production environment when we deploy the application to a service, it assigns
                                          a port to the environmental variable. but in development environment it is unavailable
                                          so that we need to give a port in that case.
                                        */
app.listen(PORT);
