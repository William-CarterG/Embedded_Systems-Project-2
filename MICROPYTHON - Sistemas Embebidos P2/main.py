import time
from umqtt.simple import MQTTClient
import ujson
import esp32

import network
import machine
import os
from machine import Pin, PWM

class Servo:
    # these defaults work for the standard TowerPro SG90
    __servo_pwm_freq = 50
    __min_u10_duty = 26 - 0 # offset for correction
    __max_u10_duty = 123- 0  # offset for correction
    min_angle = 0
    max_angle = 180
    current_angle = 0.001
    state = 0


    def __init__(self, pin):
        self.__initialise(pin)


    def update_settings(self, servo_pwm_freq, min_u10_duty, max_u10_duty, min_angle, max_angle, pin):
        self.__servo_pwm_freq = servo_pwm_freq
        self.__min_u10_duty = min_u10_duty
        self.__max_u10_duty = max_u10_duty
        self.min_angle = min_angle
        self.max_angle = max_angle
        self.__initialise(pin)


    def move(self, angle, speed=1.0):
        # round to 2 decimal places, so we have a chance of reducing unwanted servo adjustments
        angle = round(angle, 2)
        # do we need to move?
        if angle == self.current_angle:
            return
        current_angle = self.current_angle
        increment = (angle - current_angle)*speed

        if increment > 0:
            step = 0.01
        else:
            step = -0.01


        self.current_angle = angle
        # calculate the new duty cycle and move the motor
        duty_u10 = self.__angle_to_u10_duty(angle)
        self.__motor.duty(duty_u10)

    def __angle_to_u10_duty(self, angle):
        return int((angle - self.min_angle) * self.__angle_conversion_factor) + self.__min_u10_duty


    def __initialise(self, pin):
        self.current_angle = -0.0001
        self.__angle_conversion_factor = (self.__max_u10_duty - self.__min_u10_duty) / (self.max_angle - self.min_angle)
        self.__motor = PWM(Pin(pin))
        self.__motor.freq(self.__servo_pwm_freq)


WIFI_SSID = ''
WIFI_PASSWORD = ''

SERVER = ''
CLIENT_ID = 'my_esp_lamp'

TOPIC_PUB = '$aws/things/' + CLIENT_ID + '/shadow/update'
TOPIC_SUB = '$aws/things/my_esp_lamp/shadow/update/delta'


# Connect to wifi

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('Connecting to network...')
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    while not wlan.isconnected():
        pass

    print('Connection successful')


# Load AWS certificates

with open('private.pem.key', 'r') as f:
    key = f.read()
with open('cert.pem.crt', 'r') as f:
    cert = f.read()

SSL_PARAMS = { 'key': key, 'cert': cert, 'server_side': False }

# Initialize led
#led = machine.Pin(26, machine.Pin.OUT)
info = os.uname()


def mqtt_connect(client_id, endpoint, ssl_params):
    mqtt = MQTTClient(
        client_id=client_id,
        server=endpoint,
        ssl=True,
        ssl_params=ssl_params    
    )
    print('Connecting to AWS IoT...')
    mqtt.connect()
    print('Done')
    return mqtt

def mqtt_publish(client, topic, message=''):
    print('Publishing message...')
    client.publish(topic, message)

def mqtt_subscribe(topic, msg):
    print('Message received...')
    message = ujson.loads(msg)
    print("message is: :", message)
    box_state(message)
    print('Done')

def box_state(message):
    global isRunning
    if message['state']['led'].get('onboard') == 1:
        print("opening box1")
        box1.move(0)
        box1.move(120)
        box1.state = message['state']['led'].get('onboard')
    if message['state']['led'].get('onboard') == 0:
        print("closing box1")
        box1.move(120)
        box1.move(0)
        box1.state = message['state']['led'].get('onboard')

    if message['state']['led'].get('box2') == 1:
        print("opening box2")
        box2.move(120)
        box2.state = message['state']['led'].get('box2')
    if message['state']['led'].get('box2') == 0:
        print("closing boxx")
        box2.move(0)
        box2.state = message['state']['led'].get('box2')
    
    if message['state']['led'].get('box3') == 1:
        print("opening box3")
        box3.move(0)
        box3.move(120)
        box3.state = message['state']['led'].get('box3')
    if message['state']['led'].get('box3') == 0:
        print("closing box3")
        box3.move(120)
        box3.move(0)
        box3.state = message['state']['led'].get('box3')
    isRunning = 1
       

mqtt = mqtt_connect(CLIENT_ID, SERVER, SSL_PARAMS)
mqtt.set_callback(mqtt_subscribe)
mqtt.subscribe(TOPIC_SUB)

box1=Servo(pin=26) 
box1.move(0)

box2=Servo(pin=25) 
box2.move(0)

box3=Servo(pin=33) 
box3.move(0)

isRunning = 0

while True:
    isRunning += 1
    # Check for disconnection
    try:
        mqtt.check_msg()
    except:
        print('Unable to check for messages.')

    mesg = ujson.dumps({
        'state':{
            'reported': {
                'device': {
                    'client': CLIENT_ID,
                    'uptime': time.ticks_ms(),
                    'hardware': info[0],
                    'firmware': info[2]
                },
                'sensors': {
                    'hall_sensor': esp32.hall_sensor()
                },
                'led': {
                    'onboard': box1.state,
                    'box2': box2.state,
                    'box3': box3.state,
                    'alarm': 0
                },
                'box1': {

                },
                'isRunning': isRunning
            }
        }
    })

    try:
        mqtt_publish(client=mqtt, message=mesg, topic=TOPIC_PUB)
    except:
        print('Unable to publish message.')
    time.sleep(5)




