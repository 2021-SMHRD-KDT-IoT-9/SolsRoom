---
<br>
<div style="font-weight: bold;">♦️team_솔의룸</div>
<div align="right">핵심프로젝트</div>
<p align="center">
<img src="readme_img/KakaoTalk_20230418_120824367.png" width="300" height="auto"/>
</p>
<div align="center">
<br>
<hr>
<h3>프로젝트 소개</h3>
<hr>
<br>
<p>아두이노를 기반으로 흡연부스 내부의 기계장치를 제어하고 흡연부스에 설치된 센서(심박수,산소포화도센서,가스센서 등)의 값을 wifi통신을통해 web에서 활용하여 사용자 및 관리자에게 서비스를제공
</p>
<h3>사용 스택</h3>
<p>
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
<br>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/Oracle-F80000?style=flat-square&logo=oracle&logoColor=white" alt="Oracle">
<br>  
<img src="https://img.shields.io/badge/Arduino%20IDE-00979D?style=flat-square&logo=arduino&logoColor=white" alt="ArduinoIDE">
<img src="https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=flat-square&logo=visual-studio-code&logoColor=white" alt="Visual Studio Code">
<img src="https://img.shields.io/badge/Google%20Charts-4285F4?style=flat-square&logo=google-charts&logoColor=white" alt="Google Charts">
<p>
<br>
<hr>
<h3>개발 목표</h3>
<hr>
<br>
<div style="max-width: 600px;">
  <table style="border-collapse: collapse; text-align: center;">
    <tr>
      <th style="background-color: gray; border: 1px solid white; padding: 10px;">흡연부스 (H/W)</th>
      <th style="background-color: gray; border: 1px solid white; padding: 10px;">사용자서비스</th>
      <th style="background-color: gray; border: 1px solid white; padding: 10px;">관리자서비스</th>
    </tr>
    <tr>
      <td style="background-color: lightgrey; border: 1px solid white; padding: 10px;">
          <ul>
            <li>퍼퓨머, 환기시스템 제어를 위한 모터 제어</li>
            <li>초음파 센서로 사용자 인식 후 조명 제어</li>
            <li>Wi-Fi통신을 통한 센서 값 Node 서버와 통신</li>
        </ul>
      </td>
      <td style="background-color: lightgrey; border: 1px solid white; padding: 10px;">
         <ul>
            <li>부스내 센서를활용한 사용자 건강측정</li>
            <li>부스 내 사용자 유무 조회 서비스</li>
            <li>흡연부스 위치조회 서비스</li>
        </ul>
      </td>
      <td style="background-color: lightgrey; border: 1px solid white; padding: 10px;">
         <ul>
            <li>실시간 이용 현황 파악</li>
            <li>실시간 시설상태 파악 및 자동 메일 전송</li>
            <li>회원 및 게시판 관리</li>
        </ul>
      </td>
    </tr>
  </table>
</div>
<br>
<hr>
<h3>개발 내용</h3>
<hr>
<br>
 <h4>IoT(H/W) 설계 흐름도</h4>
  <img src="readme_img/HW흐름도.png">

 <h4>서비스 흐름도</h4>
  <img src="readme_img/서비스_흐름도.png">

 <h4>E-R다이어그램</h4>
  <img src="readme_img/E-R다이어그램.png">
 <br>
 <hr>
 <h3>주요 기능소개</h3>
 <hr>
 <br>
 <div align="left">  
    <h4>아두이노 통신<h4>
    <div>🔹센서로부터 MEGA2560 보드로 받아지는 값들은 Serial2 통신으로 ESP32 보드에 전달후 서버(Node)와 양방향통신 구현</div>
    <h4>사용자 서비스</h4>
    <p style="font-weight: bold;">🟩부스상태조회</p>  
    <div>🔹아두이노로 부터 받은 초음파값을 서버에서 처리후 실시간으로 web사이트 반영(비동기식) 후 db에 해단 데이터 저장</div><br>
    <p style="font-weight: bold;">🟩건강정보조회</p>
    <div>🔹DB에 저장된 사용자건강데이터와 서버에 JSON형태로 저장된 평균건강정보 데이터를 파싱하여 Google Chart API를 활용하여 DOM 데이터 시각화</div>
    <h4>관리자 서비스</h4>
    <p style="font-weight: bold;">🟩관리자 시설 관리</p>
    <div>🔹아두이노에서 이상값을 서버에 전달하면 서버에서 고장을 판단하여 고장판별이난 부스의관리자에게 메일전송(NodeMailer활용) 그 후 관리자웹에서 시설 고장로그 확인 </div>
 </div>
<br>
<hr>
<h3>팀원 소개</h3>
<hr>
<br>
<image src="https://user-images.githubusercontent.com/77195736/232770304-69d3da91-6bbf-4a11-b50a-24fd8b73758c.png">


</div>





