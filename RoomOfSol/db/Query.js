module.exports =
{
    // 멤버 테이블 조회
    SelectMembers : `SELECT * FROM MEMBER`,
    // 멤버 로그인
    login : `SELECT * FROM MEMBER WHERE MEMBER_ID = :memberId AND MEMBER_PW = :memberPw`,
    // 멤버 조회
    selectMember: `SELECT * FROM MEMBER WHERE MEMBER_ID = :memberId`,
    // 회원가입
    insertMember : `INSERT INTO Member (member_id, member_pw, nick, gender, age, years_smok, daily_smok) VALUES (:memberId, :memberPw, :nick, :gender, :age, :yearsSmok, :dailySmok)`,
    // 부스데이터 수집
    insertBoothState : `INSERT INTO FACILITY_STATE (U_ID, GAS_LEVEL, IR_DETECTION, BOOTH_ID, F_DATE) VALUES (UID_INDEX.NEXTVAL, :gasLevel, :irDetection, :boothId, SYSDATE)`,
    // 멤버 건강데이터 수집
    insertMemberHealth : `INSERT INTO MEMBER_HEALTH (U_ID, HEART_RATE, SPO2, MEMBER_ID, MH_DATE) VALUES (MEMBER_HEALTH_SEQ.NEXTVAL, :heartRate, :spo2, :memberId, SYSDATE)`,
    // 부스데이터 조회
    selectBoothState : `SELECT * FROM FACILITY_STATE`,
    // 부스정보 조회
    selectBoothInfo : `SELECT * FROM FACILITY_INFO`,
    // 부스정보 입력
    insertBoothInfo : `INSERT INTO FACILITY_INFO (BOOTH_ID, BOOTH_ADDR, MANAGER_EMAIL) VALUES (:boothId, :boothAddress, :managerEmail)`,
    // 공지사항 조회
    selectConBoard : `SELECT * FROM BOARD WHERE NICK = '관리자' ORDER BY U_ID DESC`,
    // 건의사항 조회
    selectUserBoard : `SELECT * FROM BOARD WHERE NICK <> '관리자' ORDER BY U_ID DESC`,
    // 공지게시판 추가
    addConBoard : `INSERT INTO BOARD (U_ID, TITLE, CONTENT, B_DATE, NICK) VALUES (BOARD_SEQ.NEXTVAL, :title, :content, SYSDATE, '관리자')`,
    // 건의게시판 추가
    addUserBoard : `INSERT INTO BOARD (U_ID, TITLE, CONTENT, B_DATE, NICK) VALUES (BOARD_SEQ.NEXTVAL, :title, :content, SYSDATE, :nick)`,
    // 부스로그 조회
    selectBoothLog : `SELECT * FROM FACILITY_LOG`,
    // 닉네임 조회
    selectNick : `SELECT NICK FROM MEMBER WHERE MEMBER_ID = :1`,
    // UID를 통한 게시판 조회
    selectUIDtoBoard : `SELECT * FROM BOARD WHERE U_ID = :1`,
    // 멤버 건강데이터 조회
    selectHealthInfo: `SELECT HEART_RATE, SPO2, MH_DATE FROM MEMBER_HEALTH WHERE MEMBER_ID = :1`
}