const express = require('express');

const BoothService = require('../Services/BoothService');
const MemberService = require('../Services/MemberService');
const BoardService = require('../Services/BoardService');
const MailService = require('../Services/MailService');

const router = express.Router();

function isAdmin(req, res, next) 
{
    if (req.session.memberId !== 'admin') 
    {
        res.redirect('/');
    }
    else {
        next();
    }
}

router.get('/conbcheck', isAdmin, async function (req, res) 
{
    const boothInfo = await BoothService.selectBoothInfo();
    const boothLog = await BoothService.selectBoothLog();
    res.render('conbcheck', {boothInfo: boothInfo.rows, boothLog: boothLog.rows});
});

router.get('/connboard', isAdmin, async function (req, res) 
{
    const nboard = await BoardService.selectNBoard();
    res.render('connboard', {nboard: nboard.rows});
});

router.get('/connboardw', isAdmin, function (req, res) 
{
    res.render('connboardw');
});

router.post('/connboardw', isAdmin, async function(req, res)
{
    const inputData = req.body;
    const nboardData=
    {
        title: inputData.title,
        content: inputData.editordata
    }
    const result = await BoardService.addNBoard(nboardData);

    if(result.rowsAffected > 0)
    {
        console.log('nboard stored');
        res.redirect('/connboard');
    }
    else
    {
        console.log('Stroing nboard is failed');
        res.redirect('/connboardw');
    }
});

router.get('/conqboard', isAdmin, async function (req, res) 
{
    const qboard = await BoardService.selectQBoard();
    res.render('conqboard', {qboard: qboard.rows});
});

router.get('/conuserinfo', isAdmin, async function (req, res) 
{
    const members = await MemberService.selectMembers();
    res.render('conuserinfo', {members: members.rows});
});

router.get('/conaddbooth', isAdmin, function (req, res) 
{
    res.render('conaddbooth');
});

router.post('/conaddbooth', async function(req, res)
{
    const inputData = req.body;
    const boothInfo = 
    {
        boothId: inputData.bname,
        boothAddr: inputData.baddress,
        managerEmail: inputData.bemail
    }

    const result = await BoothService.addBoothInfo(boothInfo);
    if(result.rowsAffected > 0)
    {
        console.log('add boothinfo success');
        res.redirect('/conbcheck');
    }
    else
    {
        console.log('add boothinfo failed');
        res.redirect('/conaddbooth');
    }

});

router.get('/con_n_read/:uid', isAdmin, async function (req, res) 
{
    const uid = req.params.uid;
    const board = await BoardService.selectOneBoard(uid);
    res.render('con_n_read', {board: board.rows[0]});
});

router.get('/con_q_read/:uid', isAdmin, async function (req, res) 
{
    const uid = req.params.uid;
    const board = await BoardService.selectOneBoard(uid);
    res.render('con_q_read', {board: board.rows[0]});
});

router.post('/sendmail/:email', isAdmin, async function(req, res, next)
{
    const toEmail = req.params.email;
    const isSend = await MailService.SendEmail(toEmail);
    console.log(isSend);
    if(isSend)
    {
        console.log('Send mail success');
        res.redirect('/conbcheck');
    }
    else
    {
        console.log('Send mail failed');
        res.redirect('/conbcheck');
    }
});
module.exports = router;