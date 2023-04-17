const oracledb = require("oracledb");
const dbConfig = require('./dbConfig');

oracledb.autoCommit = true;

let pool;

async function connectToDb()
{
    try
    {
        pool = await oracledb.createPool(dbConfig);
        console.log('Connected to database');
    }
    catch(err)
    {
        console.error(err);
    }
}

async function getConnection()
{
    let conn;
    try
    {
        conn = await oracledb.getConnection();
    }
    catch(err)
    {
        console.error(err);
    }
    return conn;
}

function getPool()
{
    return pool
}

async function doRelease(conn)
{
    try
    {
        await conn.close();
    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports=
{
    connectToDb,
    getConnection,
    getPool,
    doRelease
}