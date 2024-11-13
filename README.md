# sunkatsuapp
 
How to run backend locally:

1. Install mongo DB:
   ikutin ini https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
   install jg MongoDB Compass biar bisa tracking datanya
2. Install Spring Boot https://docs.spring.io/spring-boot/installing.html (harusnya ini diskip aja aman klo dah ada jdk 23)
   Intall JDK 23 di : https://www.oracle.com/cis/java/technologies/downloads/
4. di MongoDB compass buat db baru serah namanya
5. di folder backend ada application.properties yang, ganti aja nama databasenya sisanya aman
6. di VS Code, install:
   - Code Generator for Java
   - Extension Pack for Java
   - Spring Boot Extension Pack
7. ke main/java/com/sunkatsu/backend/BackendApplication.java, di kanan atas layar ada tombol play. Klik dropdownnya
   pilih run java.
8. Go to [localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) untuk ngeliat semua API nya.
   Yang di pake yang ada "/api" nya saja. Hiraukan yang tidak ada "/api"!
   Gw gtw cara ngilangin yg entity controllernya - Raygama

Note:
- Kalau ada error kaya not authenticated di mongodb, ke mongodb compass, hover koneksi mongodbnya nnti ada tulisan open mongosh.
  ![image](https://github.com/user-attachments/assets/5498e572-ac91-48ab-be5c-8d85d17be425)
  Klik open mongosh dan jalanin kode berikut:
   use admin
 db.createUser(
   {
     user: "contoh",
     pwd: "contoh", // or cleartext password
     roles: [ 
       { role: "userAdminAnyDatabase", db: "admin" },
       { role: "readWriteAnyDatabase", db: "admin" } 
     ]
   }
 )
Ganti "contoh" dengan yang kamu mau, nanti di application.properties ditambahin/ganti saja sesuai itu. Contoh:
spring.data.mongodb.username=contoh
spring.data.mongodb.password=contoh












































































































































is this shit even worth it?
  
