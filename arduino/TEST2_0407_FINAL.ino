#include <TFT.h>
#include <b64.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <MAX30105.h>
#include <heartRate.h>
#include <MQ7.h>
#include <MQ135.h>
#include "spo2_algorithm.h"
#include <Adafruit_NeoPixel.h>

#define TRIG 50 //TRIG 핀 설정 (초음파 보내는 핀)
#define ECHO 51 //ECHO 핀 설정 (초음파 받는 핀)
#define MAX_BRIGHTNESS 255
#define MAX30102_MODE_HR 2
#define BUFFER_SIZE 100
#define MAX30102_ADDRESS 0x57
#define SENSOR_FAILURE_THRESHOLD 10000 
#define LED_PIN 6      // 네오픽셀 D핀과 연결한 아두이노 핀 번호
#define LED_COUNT 60   // 네오픽셀 LED 개수
#define BRIGHTNESS 50  // 네오픽셀 LED 밝기(0 ~ 255) *RGBW만
#define ledPin 7
#define coolingPan 12 // 쿨링팬을 디지털 12번과 연결
#define smellPan 11   // 방향제를 디지털 11번과 연결
#define but 9 // 팬 돌리는 버튼을 디지털 12번과 연결

int mq7Pin = A0;  // MQ7 센서 아날로그 핀
int mq135Pin = A1;  // MQ135 센서 아날로그 핀
unsigned long lastMq7ReadingTime = 0;
unsigned long lastMq135ReadingTime = 0;
int peopleIn = 0;  //초음파센서로 사람 있는 지 없는지 판단하는 변수

int color_r;  // RED
int color_g;    // GREEN
int color_b;    // BLUE

// LCD 모듈 정보
const int lcdColumns = 16;
const int lcdRows = 2;
const int lcdAddr = 0x27;
LiquidCrystal_I2C lcd(lcdAddr, lcdColumns, lcdRows);

// MAX30102 센서 객체
MAX30105 particleSensor;
uint32_t irBuffer[100]; //infrared LED sensor data
uint32_t redBuffer[100];  //red LED sensor data
int32_t bufferLength; //data length
int32_t spo2; //SPO2 value
int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
int32_t heartRate; //heart rate value
int8_t validHeartRate; //indicator to show if the heart rate calculation is valid
byte pulseLED = 11; //Must be on PWM pin
byte readLED = 13; //Blinks with each data read
long lastBeat = 0; //Time at which the last beat occurred
float beatsPerMinute;

 // lcd 모니터 오른쪽 화살표
byte arrow_right[8] = {
  B00000,
  B00100,
  B01000,
  B11111,
  B01000,
  B00100,
  B00000,
  B00000
};

// led 객체 생성(한가지 색만)
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);


// MQ7 센서로부터 PPM 값을 계산하는 함수
float getMQ7PPM(int raw) {
  float voltage = (raw / 1024.0) * 5.0;  // 아날로그 값을 전압 값으로 변환
  float ppm = (voltage - 0.1) * 10000.0 / 0.8;  // PPM 값 계산
  return ppm;
}
// MQ135 센서로부터 PPM 값을 계산하는 함수
float getMQ135PPM(int raw) {
  float voltage = (raw / 1024.0) * 5.0;  // 아날로그 값을 전압 값으로 변환
  float rsAir = (5.0 - voltage) / voltage;  // 공기 저항 계산
  float ratio = rsAir / 3.6;  // 측정 저항과 공기 저항 비율 계산
  float ppm = pow(10, (1.3346 * log10(ratio) + 3.8143));  // PPM 값 계산
  return ppm;
}

//mq7,mq135 센서가 10초이상 값을 읽기 못할 때 고장이라고 판단하는 함수
int mq7ErrorCheck(){
    if (millis() - lastMq7ReadingTime > SENSOR_FAILURE_THRESHOLD) {
    return 1;
    }
    else{
      return 0;
    }
}

int mq135ErrorCheck(){
    if (millis() - lastMq135ReadingTime > SENSOR_FAILURE_THRESHOLD) {
    return 1;
    }
    else{
      return 0;
    }
}

void setup() {
  Serial.begin(115200);  // 시리얼 통신 시작
  Serial2.begin(115200); // esp32 통신시작 

  pinMode(TRIG, OUTPUT); //초음파센서
  pinMode(ECHO, INPUT); //초음파센서
  pinMode(pulseLED, OUTPUT); //MAX30102
  pinMode(readLED, OUTPUT); //MAX30102
  pinMode(coolingPan, OUTPUT); // 쿨링팬릴레이
  pinMode(smellPan, OUTPUT); // 방향제릴레이 
  pinMode(but, OUTPUT); // 쿨링팬버튼
  pinMode(ledPin, OUTPUT); // 부스 안 led 
  Wire.begin(); //i2c 총신 초기화 

  lcd.init();   // LCD 모듈 초기화
  lcd.backlight();
   // LCD 모듈에 출력할 문자열을 설정합니다.
  lcd.setCursor(2, 0);
  lcd.print("Attach sensor");
  lcd.createChar(0, arrow_right);
  lcd.setCursor(15, 2);
  lcd.write(byte(0));

   //LED
  strip.begin();                    // 네오픽셀 초기화(필수)
  strip.setBrightness(BRIGHTNESS);  // 네오픽셀 밝기 설정 *RGBW만
  strip.show();

   if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
   Serial.println(F("MAX30105 was not found. Please check wiring/power.//"));
   while (1);
  }

   byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //

}

void loop() {
   Serial.print(digitalRead(but));
   digitalWrite(TRIG, HIGH);
    delay(10);
    digitalWrite(TRIG, LOW);
    long duration = pulseIn(ECHO, HIGH); 
    long distance =((float)(340*duration)/1000)/2;
    if (distance <= 100) {
      static unsigned long startTime = millis();
      if ((millis() - startTime) >= 4000) {
        peopleIn = 1;
      }
      else{
        peopleIn = 0;
      }
    } else {
      peopleIn = 0;
    }
      Serial.println(peopleIn);
      Serial.print("Duration : ");
      Serial.println(duration);
      Serial.print("Distance : ");
      Serial.println(distance);

      //안쪽 led 키는 부분 
  /
    if(peopleIn == 1){
       analogWrite(ledPin, 255); //사람이 있을 때 최대 밝기 
      delay(1000);
    }
    else{
      analogWrite(ledPin, 20); // 사람 없을 때 밝기 약하게 
      delay(1000);
    }


//바깥 led를 키는 부분
  if(mq7ErrorCheck()==0 || mq135ErrorCheck()==0){
    //가스센서가 둘 중 하나라도 고장일 때 빨간불이 켜지도록
    color_r = 255;
    color_g = 0; 
    color_b = 0; 
    for (int i = 0; i < LED_COUNT; i++) {
      strip.setPixelColor(i, color_r, color_g, color_b, 0);
      // RGB일 경우 strip.setPixelColor(i, color_r, color_g, color_b);
    }
  // 네오픽셀 설정값 적용하기
         strip.show();
          Serial.println("red");
    }
   else{
     if(peopleIn==1){
       //사용중일 때 노란색
         color_r = 255;
         color_g =255; 
         color_b = 0; 
            for (int i = 0; i < LED_COUNT; i++) {
                strip.setPixelColor(i, color_r, color_g, color_b, 0);
              // RGB일 경우 strip.setPixelColor(i, color_r, color_g, color_b);
            }  strip.show();
            Serial.println("yellow");
            
     }
     else if(peopleIn==0){
         color_r = 0;
         color_g =255; 
         color_b = 0; 
            for (int i = 0; i < LED_COUNT; i++) {
                strip.setPixelColor(i, color_r, color_g, color_b, 0);
              // RGB일 경우 strip.setPixelColor(i, color_r, color_g, color_b);
            } strip.show();
            Serial.println("green");

     }
     }



  // MAX30102 센서에서 심박수,SP02구하는 코드
  bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps
  long irValue = particleSensor.getIR();

  //read the first 100 samples, and determine the signal range
 for (byte i = 0 ; i < bufferLength ; i++)
 {
   while (particleSensor.available() == false) //do we have new data?
     particleSensor.check(); //Check the sensor for new data

   redBuffer[i] = particleSensor.getRed();
   irBuffer[i] = particleSensor.getIR();
   particleSensor.nextSample(); //We're finished with this sample so move to next sample

 }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

    
  Serial.print("heartRate : ");
  Serial.print(heartRate);
  Serial.print("SpO2: ");
  Serial.print(spo2);
  Serial.println(" %");
 
    // Heart Rate와 SpO2 값을 LCD 모듈에 출력합니다.
  lcd.clear() ;
  lcd.setCursor(3, 0);
  lcd.print("Your Health Data");
  lcd.setCursor(0, 2);
  lcd.print("Heart Rate:");
  lcd.print(heartRate);
  lcd.setCursor(0, 3);
  lcd.print("SpO2:");
  lcd.print(spo2);  

  // MQ7 센서로부터 이산화탄소 농도 측정
  int mq7Value = analogRead(mq7Pin);  // 아날로그 값 읽기
  float mq7PPM = getMQ7PPM(mq7Value);  // PPM 값 계산
  Serial.print("CO2 (PPM): ");
  Serial.print(mq7PPM);
  Serial.print("\t");

  // MQ135 센서로부터 일산화탄소 농도 측정
  int mq135Value = analogRead(mq135Pin);  // 아날로그 값 읽기
  float mq135PPM = getMQ135PPM(mq135Value);  // PPM 값 계산
  Serial.print("CO (PPM): ");
  Serial.println(mq135PPM);


  int but1 = digitalRead(but);
  //쿨링팬 돌리는 모듈
  if(mq7PPM >=200 || mq135PPM >=2000 || but1==HIGH){
      digitalWrite(coolingPan, 1);
      delay(400000);
      digitalWrite(coolingPan, 0);
      digitalWrite(smellPan, 1);
      delay(1000);
      digitalWrite(smellPan, 0);
  }
  else{
      digitalWrite(coolingPan, LOW);
      digitalWrite(smellPan, 0);
      delay(1000);
  }
 
  String message =  String(distance) + "," + String(mq7PPM)  + "," + String(mq135PPM) + "," + String(spo2) + "," + String(heartRate)+ "\n"; // 메시지를 구성합니다.
  Serial2.println(message); // Serial2를 통해 메시지를 전송합니다.
  delay(1000); // 1초의 딜레이를 줍니다.;
  Serial.println(message);
  delay(1000);



}
