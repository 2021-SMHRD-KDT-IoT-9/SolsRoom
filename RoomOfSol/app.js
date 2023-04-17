const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');

const db = require('./db/database');
const defaultRoutes = require('./routes/default');
const userinfoRoutes = require('./routes/userinfo');
const infoRoutes = require('./routes/info');
const managementRoutes = require('./routes/management');
const dataRoutes = require('./routes/data');
const port = 3000;
const app = express();

db.connectToDb();

app.use(session(
    {
        secret : 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        memberId: null
    }
));

app.use(function(req, res, next)
{
    res.locals.session = req.session;
    if(req.session.memberId === undefined)
    {
        req.session.memberId = null;
    }
    next();
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger("dev"));




app.use('/', defaultRoutes);
app.use('/', userinfoRoutes);
app.use('/', infoRoutes);
app.use('/', managementRoutes);
app.use('/', dataRoutes);


app.use(function(req, res)
{
    res.render('./error/404');
});

app.use(function(error, req, res, next)
{
    console.log(error);
    res.render('./error/500');
});



app.listen(port, ()=>
{
    console.log(`Server Load success. http://220.80.165.95:${port}`);
});

