int led1 = D0; // BLUE  

int led3 = D1; // GREEN
int led2 = D2; //RED



 int controlled(String strPin){

 
   
    
    Serial.println();
    Serial.print("argument: ");
    Serial.println(strPin);

     Spark.publish("args",strPin);
    if(strPin.equalsIgnoreCase("RED")){
         digitalWrite(led1, LOW);
  digitalWrite(led2, HIGH);
  digitalWrite(led3, LOW);

    }
    else if(strPin.equalsIgnoreCase("GREEN")){
        digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, HIGH);

    }else if(strPin.equalsIgnoreCase("BLUE")){
        
          digitalWrite(led1, HIGH);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);

        
    }       
    else{
          digitalWrite(led1, LOW);
  digitalWrite(led2, LOW);
  digitalWrite(led3, LOW);

    }
    
   return 1;
 
}







void setup() {
    Serial.begin(115200);

  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
    pinMode(led3, OUTPUT);
    
  
    Particle.function("ctrlled", controlled);
}

void loop() {
 
    delay(1000);
}