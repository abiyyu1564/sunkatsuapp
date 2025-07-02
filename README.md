<h1 align="center">🥢 SUNKATSUAPP</h1>

<p align="center"><em>Transforming dining with seamless, intelligent experiences</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-today-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/dart-36.7%25-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/languages-11-blue?style=flat-square" />
</p>

<hr/>

<h3 align="center">🛠️ Built with the tools and technologies:</h3>



### <p align="center">General & Backend</p>

<p align="center">
  <img src="https://img.shields.io/badge/-JSON-black?logo=json&style=flat-square" />
  <img src="https://img.shields.io/badge/-JetBrains-black?logo=jetbrains&style=flat-square" />
  <img src="https://img.shields.io/badge/-Markdown-black?logo=markdown&style=flat-square" />
  <img src="https://img.shields.io/badge/-Spring-black?logo=spring&style=flat-square" />
  <img src="https://img.shields.io/badge/-Gradle-02303A?logo=gradle&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/-npm-CB3837?logo=npm&style=flat-square" />
  <img src="https://img.shields.io/badge/-Autoprefixer-E43E2B?logo=autoprefixer&style=flat-square" />
  <img src="https://img.shields.io/badge/-PostCSS-DD3A0A?logo=postcss&style=flat-square" />
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square" />
  <img src="https://img.shields.io/badge/-Org-77AA99?logo=org&style=flat-square" />
</p>


### <p align="center">Frontend & Mobile</p>

<p align="center">
  <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square" />
  <img src="https://img.shields.io/badge/-Flutter-02569B?logo=flutter&style=flat-square" />
  <img src="https://img.shields.io/badge/-Dart-0175C2?logo=dart&style=flat-square" />
  <img src="https://img.shields.io/badge/-Swift-FA7343?logo=swift&style=flat-square" />
  <img src="https://img.shields.io/badge/-Kotlin-7F52FF?logo=kotlin&style=flat-square" />
  <img src="https://img.shields.io/badge/-Axios-5A29E4?logo=axios&style=flat-square" />
</p>



### <p align="center">DevOps & Infra</p>

<p align="center">
  <img src="https://img.shields.io/badge/-Docker-2496ED?logo=docker&style=flat-square" />
  <img src="https://img.shields.io/badge/-CMake-064F8C?logo=cmake&style=flat-square" />
  <img src="https://img.shields.io/badge/-YAML-CF142B?logo=yaml&style=flat-square" />
  <img src="https://img.shields.io/badge/-XML-0060AC?logo=xml&style=flat-square" />
  <img src="https://img.shields.io/badge/-C++-00599C?logo=c%2B%2B&style=flat-square" />
</p>

---

<p align="center"><em>SUNKATSUAPP is a modern dining app that integrates intelligent solutions across frontend, backend, and mobile platforms.</em></p>


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
- [Test Report and Other QA Documents](https://drive.google.com/drive/folders/14aXQQfxreq4X-M0Qq5zyV2W6cBolL9V3?usp=drive_link)

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








































































































































  
