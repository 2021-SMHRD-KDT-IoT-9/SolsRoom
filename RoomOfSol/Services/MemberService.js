const session = require('express-session');

const db = require('../db/database');
const query = require('../db/Query');

async function LoginService(member)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.login, [member.memberId, member.memberPw]);  
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
    db.doRelease(conn);
    return result;
    
}

async function JoinService(member)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.insertMember,[
            member.memberId,
            member.memberPw,
            member.nick,
            member.gender,
            member.age,
            member.yearsSmok,
            member.dailySmok
        ]);
    }
    catch(err)
    {
        console.log(err);
    }
    db.doRelease(conn);
    return result;
}

function LogoutService(req)
{
    req.session.memberId = null;
    
}

async function selectMembers()
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.SelectMembers, []);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

function getHealthData(sensorData)
{
    const healthData=
    {
        heartRate: sensorData,
        spo2: sensorData.spo2,
        memberId: sensorData.memberId
    }

    return healthData;
}

async function StoredMemberHealth(healthData)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.insertMemberHealth, [
            healthData.heartRate,
            healthData.spo2,
            healthData.memberId
        ]);
    }
    catch(err)
    {
        console.log(err);
    }
    db.doRelease(conn);
    return result;
}

async function selectNick(req)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectNick, [
            req.session.memberId
        ]);
    }
    catch(err)
    {
        console.log(err);
    }
    db.doRelease(conn);
    return result;
}

async function selectMember(memberId)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectMember,[memberId]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}
module.exports = 
{
    Join: JoinService,
    Login: LoginService,
    Logout: LogoutService,
    selectMembers,
    getHealthData,
    StoredMemberHealth,
    selectNick,
    selectMember
}