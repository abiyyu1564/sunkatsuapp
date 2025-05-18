# SunkatsuApp

Sunkatsu App is an app dedicated to a tenant in one of the Cafetaria in Telkom University. It features in-app chat, orders, and chatbot to help users with their experience. Technologies used are Spring-Boot, ReactJS, Tailwind, and Flutter for the mobile app.

## Key Features
- Tracking, updating, and management of menus only for specified user role
- Authentication and security with JWT
- In-app chat feature between users using Websockets and StompJS
- Chatbot to help users with their experience using LLM model: Qwen-2.5:3B
- Ordering system for customers
- Order management for staffs
- Menu and Order management for the owner

## Use this locally
```
git clone https://github.com/abiyyu1564/sunkatsuapp.git
```
## Requirements & Documents
- [SRS](https://drive.google.com/drive/folders/1tv5O4oXvUdE8DsZNaVZCExapDN4Xfgfr)
- [SDD](https://drive.google.com/drive/folders/1tv5O4oXvUdE8DsZNaVZCExapDN4Xfgfr)
- [Test Plan](https://drive.google.com/drive/folders/1tv5O4oXvUdE8DsZNaVZCExapDN4Xfgfr)

## Developers
- [M. Daffa Raygama (PM, Backend, Mobile)](https://github.com/Raygama)
- [Rifqy Khuzaini (Front end, UI)](https://github.com/zexrun)
- [Abiyyu Abdurrafi Ahmad (Front end, UI)](https://github.com/abiyyu1564)
- [Melinda Triandari (Front end, UI)](https://github.com/melindatr)
- [Rangga Aldora Permadi (Mobile, Backend)](https://github.com/permadirangga)
- [M Fathurahman Aldesrand (Mobile, Backend)](https://github.com/ftr867)

## Testers
- [M. Daffa Raygama (Test Manager)](https://github.com/Raygama)
- [Fausta Akbar(Tester)]()
- [Zaidaan Afif Randih(Tester)](https://github.com/ZaidaanRandih)
- [Raisa Aliya (Technical Writer)]()
- [Rifqy Khuzaini (Tester)](https://github.com/zexrun)

 
How to run backend locally:

1. Install Spring Boot https://docs.spring.io/spring-boot/installing.html
   Intall JDK 23 di : https://www.oracle.com/cis/java/technologies/downloads/
2. run `mvn spring-boot:run` in the `backend` folder.
3. Go to [localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) to view the APIs.

How to run web front end: 
1. Go to the `sunkatsu_fe` directory and run this in the terminal: `npm run start`

How to run the mobile app:
1. Go to Android Studio and run the main.dart file

Note:
- run this in cmd before running the mobile app on a real phone: `adb reverse tcp:8080 tcp:8080` 








































































































































  
