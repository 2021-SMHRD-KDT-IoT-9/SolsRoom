google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // 회원 건강 데이터 가져오기
  const healthData = '<%= JSON.stringify(healthData) %>';
  const avgHeartRate = '<%= JSON.stringify(avgHeartRate) %>';

  // 데이터 배열 생성
  const data = new google.visualization.DataTable();
  data.addColumn('string', '날짜');
  data.addColumn('number', '심박수');
  data.addColumn('number', '평균 심박수');
  healthData.forEach((row) => {
    data.addRow([row.date, row.heartRate, null]);
  });
  data.addRow(['평균', null, avgHeartRate]);

  // 차트 옵션 설정
  const options = {
    title: '회원 건강 데이터',
    curveType: 'function',
    legend: { position: 'bottom' },
  };

  // 차트 생성 및 그리기
  const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}