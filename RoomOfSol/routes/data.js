const express = require('express');
const fs = require('fs');
const BoothService = require('../Services/BoothService');
const MemberService = require('../Services/MemberService');

const router = express.Router();

router.post('/data', async function(req, res)
{
    const sensorData = req.body;
    sensorData.boothID = 'booth1';
    sensorData.memberId = 'smhrd1';
    console.log(sensorData);
    
    const boothData = BoothService.getBoothData(sensorData);
    const healthData = MemberService.getHealthData(sensorData);
    const result_booth = await BoothService.storedBoothData(boothData);
    const result_health = await MemberService.storedHealData(healthData)

    if(result_booth.rowsAffected > 0 )
    {
        console.log('Booth1 Data stored')
    }
    else
    {
        console.log('Storing Booth1 Data is Failed')
    }
    if(result_health.rowsAffected > 0)
    {
        console.log('health Data stored')
    }
    else
    {
        console.log('Storing health Data is Failed')
    }

    res.send('Data received!');
});

router.post('/data2', async function(req, res)
{
    const sensorData = req.body;
    sensorData.boothID = 'booth2';
    sensorData.memberId = 'smhrd2';
    console.log(sensorData);
    
    const boothData = BoothService.getBoothData(sensorData);
    const healthData = await BoothService.storedBoothData(boothData);
    const result_booth = await BoothService.storedBoothData(boothData);
    const result_health = await MemberService.storedHealData(healthData)

    if(result_booth.rowsAffected > 0)
    {
        console.log('Booth2 Data stored')
    }
    else
    {
        console.log('Storing Booth2 Data is Failed')
    }
    if(result_health.rowsAffected > 0)
    {
        console.log('health Data stored')
    }
    else
    {
        console.log('Storing health Data is Failed')
    }

    res.send('Data received!');
});


module.exports = router;