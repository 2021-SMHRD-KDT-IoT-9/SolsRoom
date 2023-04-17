const express = require('express');
const router = express.Router();

router.get('/', function(req, res)
{
    res.render('usermain');
});

router.get('/conmain', function(req, res)
{
    if(req.session.memberId !== 'admin')
    {
        res.redirect('/');
    }
    else
    {
        res.render('conmain');
    }
});

module.exports = router;