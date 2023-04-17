const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'data', 'avgHealth.json');
const db = require('../db/database');
const query = require('../db/Query');

function getAvgHealth(age, gender) 
{
    const fileData = fs.readFileSync(filePath);
    const avgHealth = JSON.parse(fileData);
    // 파싱한 데이터를 확인
    console.log(avgHealth);
    // 나이와 성별을 입력받아 데이터를 반환
    if (gender === 'male') {
        avgHealth.male.age_range.forEach((range) => {
            if (age >= range.min && (age <= range.max || range.max === null)) {
                avgRate = avgHealth.male.avg_heart_rate.find((rate) => rate.avg_rate !== null);
            }
        });
    } else if (gender === 'female') {
        avgHealth.female.age_range.forEach((range) => {
            if (age >= range.min && (age <= range.max || range.max === null)) {
                avgRate = avgHealth.female.avg_heart_rate.find((rate) => rate.avg_rate !== null);
            }
        });
    }
    console.log(avgRate)
    if (avgRate !== null) {
        return avgRate.avg_rate;
    } else {
        return null;
    }
}

async function selectHealthInfo(memberId)
{
    let conn;
    let result;
    try
    {
        conn = await db.getConnection();
        result = await conn.execute(query.selectHealthInfo,[memberId]);
    }
    catch(err)
    {
        console.log(err)
    }
    db.doRelease(conn);
    return result;
}

module.exports = {
    getAvgHealth,
    selectHealthInfo
};