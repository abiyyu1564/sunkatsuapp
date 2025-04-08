# sunkatsuapp
 
How to run backend locally:


1. Install mongo DB: (Skip klo application.properties dah ngikut grup wa)
   ikutin ini https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
   install jg MongoDB Compass biar bisa tracking datanya
2. Install Spring Boot https://docs.spring.io/spring-boot/installing.html (harusnya ini diskip aja aman klo dah ada jdk 23)
   Intall JDK 23 di : https://www.oracle.com/cis/java/technologies/downloads/
4.  di VS Code, install:
   - Code Generator for Java
   - Extension Pack for Java
   - Spring Boot Extension Pack
5. ke main/java/com/sunkatsu/backend/BackendApplication.java, di kanan atas layar ada tombol play. Klik dropdownnya
   pilih run java. Atau run ini di terminal kalau dah install mvn: `mvn spring-boot:run`
6. Go to [localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) untuk ngeliat semua API nya.
   Yang di pake yang ada "/api" nya saja. Hiraukan yang tidak ada "/api"!
   Gw gtw cara ngilangin yg entity controllernya - Raygama

Note:
- Ganti application properties dengan yang gw kirim di wa (nvm some dude leaked our uri to the world 💀)
- run this in cmd before running the mobile app on a real phone: `adb reverse tcp:8080 tcp:8080` 








































































































































  
