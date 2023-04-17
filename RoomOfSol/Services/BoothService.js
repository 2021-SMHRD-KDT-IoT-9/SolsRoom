const db = require('../db/database');
const query = require('../db/Query');

function getBoothData(sensorData)
{
    // 센서데이터를 부스상태테이블에 맞게 로직처리
    // boothData로 객체 생성해서 리턴
    const boothData = 
    {
        gasLevel: sensorData.gasLevel,
        irDetection: sensorData.distance,
        boothId: sensorData.boothID
    }

    return boothData;
}

async function storedBoothData(boothData)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.insertBoothState, [
            boothData.gasLevel,
            boothData.irDetection,
            boothData.boothId
        ]);
    }
    catch(err)
    {
        console.log(err);
    }
    db.doRelease(conn);
    return result;
}

async function selectBoothInfo()
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectBoothInfo, []);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

async function addBoothInfo(boothInfo)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.insertBoothInfo, [
            boothInfo.boothId,
            boothInfo.boothAddr,
            boothInfo.managerEmail
        ]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

async function selectBoothLog()
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectBoothLog, []);
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
    getBoothData,       // 센서데이터를 부스데이터로 변환
    storedBoothData,    // 부스데이터를 저장
    selectBoothInfo,    // 부스정보를 조회
    addBoothInfo,       // 부스정보를 추가
    selectBoothLog
}