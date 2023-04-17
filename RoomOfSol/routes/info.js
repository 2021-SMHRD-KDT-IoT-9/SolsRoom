const express = require('express');
const session = require('express-session');
const BoardService = require('../Services/BoardService');
const BoothService = require('../Services/BoothService');
const MemberService = require('../Services/MemberService');
const HealthService = require('../Services/HealthService');

const router = express.Router();

router.get('/userhcheck', function(req, res)
{
    res.render('userhcheck');
});

router.get('/chart', async function(req, res)
{
    const memberId = req.session.memberId;
    const member = await MemberService.selectMember(memberId);
    const age = member.rows[0][3];
    const gender = member.rows[0][6];

    const avgHeartRate = HealthService.getAvgHealth(age, gender);
    const healthInfo = await HealthService.selectHealthInfo(memberId);
    const healthData = healthInfo.rows.map(row=>({
        heartRate: row[0],
        spo2: row[1],
        date: row[2]
    }));
    
    res.render('chart',{avgHeartRate:avgHeartRate, healthData:healthData});
});

router.get('/userbcheck', async function(req, res)
{
    const boothInfo = await BoothService.selectBoothInfo();
    const boothLog = await BoothService.selectBoothLog();
    res.render('userbcheck', {boothInfo : boothInfo.rows, boothLog: boothLog.rows});
});

router.get('/usernboard', async function(req, res)
{
    const nboard = await BoardService.selectNBoard();
    res.render('usernboard', {nboard : nboard.rows});
});

router.get('/userqboard', async function(req, res)
{
    const qboard = await BoardService.selectQBoard();
    res.render('userqboard', {qboard : qboard.rows});
});

router.get('/userintro', function(req, res)
{
    res.render('userintro');
});

router.get('/userqboardw', function(req, res)
{
    res.render('userqboardw');
});

router.post('/userqboardw', async function(req, res)
{
    const inputData = req.body
    let nick = await MemberService.selectNick(req);
    nick = nick.rows[0][0];
    const qboard=
    {
        title: inputData.title,
        content: inputData.editordata, 
        nick: nick
    }
    const result = await BoardService.addQBoard(qboard);
    if(result.rowsAffected > 0)
    {
        console.log('qboard stored');
        res.redirect('/userqboard');
    }
    else
    {
        console.log('Stroing qboard is failed');
        res.redirect('/userqboardw');
    }

})

router.get('/user_n_read/:uid', async function(req, res)
{
    let uid = req.params.uid;
    const board = await BoardService.selectOneBoard(uid);
    res.render('user_n_read', {board: board.rows[0]});
});

router.get('/user_q_read/:uid', async function(req, res)
{
    let uid = req.params.uid;
    const board = await BoardService.selectOneBoard(uid);
    res.render('user_q_read', {board: board.rows[0]});
});

module.exports = router;