const express = require('express');
const session = require('express-session');

const Member = require('../Services/MemberService');

const router = express.Router();

router.get('/login', function (req, res) 
{
    res.render('login');
});

router.post('/login', async function (req, res, next) {
    const member = 
    {
        memberId : req.body.memberId,
        memberPw : req.body.memberPw
    };
    console.log(member.memberId);
    console.log(member.memberPw);
    const result = await Member.Login(member);
    console.log(result.rows);
    if (result.rows.length > 0) 
    {
        req.session.memberId = member.memberId;
        console.log('session :'+req.session.memberId)
        console.log('login success');
        if(member.memberId === 'admin')
        {
            console.log('admin login');
            res.redirect('/conmain');
        }
        else
        {
            res.redirect('/');
        }
    }
    else 
    {
        console.log('login failed');
        res.redirect('/login')
    }
    
});

router.get('/logout', function (req, res)
{
    Member.Logout(req);
    res.redirect('/');
});

router.get('/join', function(req, res)
{
    res.render('join')
});

router.post('/join', async function(req, res)
{
    const member=
    {
        memberId:   req.body.memberId,
        memberPw:   req.body.memberPw,
        nick:       req.body.nick,
        gender:     req.body.gender,
        age:        req.body.age,
        yearsSmok:  req.body.yearsSmok,
        dailySmok:  req.body.dailySmok
    }
    console.log(member.memberId, member.memberPw, member.nick);
    const result = await Member.Join(member);

    if( result.rowsAffected > 0)
    {
        console.log('join success');
        res.redirect('/');
    }
    else 
    {
        console.log('join failed');
        res.redirect('/join')
    }
});

module.exports = router;