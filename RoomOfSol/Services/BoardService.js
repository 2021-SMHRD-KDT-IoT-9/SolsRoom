const db = require('../db/database');
const query = require('../db/Query');

async function selectNBoard()
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectConBoard, []);

    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

async function addNBoard(nboardData)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.addConBoard, [
            nboardData.title,
            nboardData.content
        ]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}
async function selectQBoard()
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectUserBoard, []);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

async function addQBoard(qboardData)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.addUserBoard,[
            qboardData.title,
            qboardData.content,
            qboardData.nick
        ]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

async function selectOneBoard(uid)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectUIDtoBoard,[uid]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

module.exports=
{
    selectNBoard,
    selectQBoard,
    addNBoard,
    addQBoard,
    selectOneBoard
}