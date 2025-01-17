#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* ssid = "VOTRE_SSID_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE_WIFI";
const char* serverUrl = "http://votre-app-nextjs.com/api/donnees-capteurs";

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  dht.begin();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connecté au WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float humidite = dht.readHumidity();
    float temperature = dht.readTemperature();
    
    if (!isnan(humidite) && !isnan(temperature)) {
      // Création du JSON pour la température
      StaticJsonDocument<200> docTemp;
      docTemp["capteurId"] = "DHT22_1";
      docTemp["type"] = "temperature";
      docTemp["valeur"] = temperature;
      
      String jsonTemp;
      serializeJson(docTemp, jsonTemp);
      envoyerDonnees(jsonTemp);
      
      // Création du JSON pour l'humidité
      StaticJsonDocument<200> docHum;
      docHum["capteurId"] = "DHT22_2";
      docHum["type"] = "humidite";
      docHum["valeur"] = humidite;
      
      String jsonHum;
      serializeJson(docHum, jsonHum);
      envoyerDonnees(jsonHum);
    }
  }
  
  delay(5000); // Attendre 5 secondes avant la prochaine lecture
}

void envoyerDonnees(String donnees) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  int codeReponseHttp = http.POST(donnees);
  
  if (codeReponseHttp > 0) {
    String reponse = http.getString();
    Serial.println("Code de réponse HTTP: " + String(codeReponseHttp));
    Serial.println(reponse);
  } else {
    Serial.println("Erreur lors de l'envoi POST: " + String(codeReponseHttp));
  }
  
  http.end();
}

