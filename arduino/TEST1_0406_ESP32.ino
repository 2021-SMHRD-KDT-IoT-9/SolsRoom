#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

const char* ssid = "HYO";
const char* password = "hyo12345";
const char* Url = "https://e3fb-220-80-165-95.ngrok.io/data"; // 서버 URL

#define RX_PIN 16 // ESP32의 Serial2 RX 핀
#define TX_PIN 17 // ESP32의 Serial2 TX 핀


String sendPeopleIn = "";
String sendMq135Value = "";
String sendMq7Value = "";
String sendSpo2 = "";
String sendHeartRate = "";
String message = "";

void parseMessage(char messageChar) {
  message += messageChar;

  if (message.endsWith("\n")) {
    message.trim();
    int commaIdx = message.indexOf(",");
    sendPeopleIn = message.substring(0, commaIdx);
    message = message.substring(commaIdx + 1);

    commaIdx = message.indexOf(",");
    sendMq135Value = message.substring(0, commaIdx);
    message = message.substring(commaIdx + 1);

    commaIdx = message.indexOf(",");
    sendMq7Value = message.substring(0, commaIdx);
    message = message.substring(commaIdx + 1);

    commaIdx = message.indexOf(",");
    sendSpo2 = message.substring(0, commaIdx);
    message = message.substring(commaIdx + 1);

    sendHeartRate = message.substring(0);
    message = "";
  }
}

void setup() {
  Serial.begin(115200); // 시리얼 통신을 시작합니다.
  Serial2.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);

    // Wi-Fi 연결
  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" connected");
}

void loop() {
  if (Serial2.available() > 0) {
    char message = Serial2.read(); // Serial2에서 메시지를 읽어옵니다.
    Serial.print(message);

    parseMessage(message);

    Serial.print(" ,sendPeopleIn : ");
    Serial.println(sendPeopleIn);
    Serial.print(" ,sendMq135 : ");
    Serial.println(sendMq135Value);
    Serial.print(" ,sendMq7 : ");
    Serial.println(sendMq7Value);
    Serial.print(" ,sendsp02 : ");
    Serial.println(sendSpo2);
    Serial.print(" ,sendHeartRate : ");
    Serial.println(sendHeartRate);

     // JSON 데이터 생성
    DynamicJsonDocument jsonDoc(1024);

    jsonDoc["peopleIn"] = sendPeopleIn.toInt();
    jsonDoc["mq135Value"] = sendMq135Value.toInt();
    jsonDoc["sendMq7Value"] = sendMq7Value.toInt();
    jsonDoc["spo2"] = sendSpo2.toInt();
    jsonDoc["heartRate"] = sendHeartRate.toInt();

  // JSON 오브젝트를 문자열로 변환
    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // HTTP POST 요청 보내기
    WiFiClient client;
    HTTPClient http;
    http.begin(client, Url, 4096);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }

}