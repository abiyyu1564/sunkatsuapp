# sunkatsuapp
 
How to run backend locally:

1. Install mongo DB:
   ikutin ini https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
   install jg MongoDB Compass biar bisa tracking datanya
3. di MongoDB compass buat db baru serah namanya
4. di folder backend ada application.properties yang, ganti aja nama databasenya sisanya aman
5. di VS Code, install:
   - Code Generator for Java
   - Extension Pack for Java
   - Spring Boot Extension Pack
6. ke main/java/com/sunkatsu/backend/BackendApplication.java, di kanan atas layar ada tombol play. Klik dropdownnya
   pilih run java.
7. Coba - coba di postman:
   - Install postman agent https://www.postman.com/downloads/postman-agent/
   - Udah tinggal coba2 endpoint:
     GET localhost:8080/api/carts
     GET localhost:8080/api/carts/{id}
     GET localhost:9080/api/carts/empty?UserId='user id nya brp'
     DELETE localhost:8080/api/carts/{cartId}/cart-items/{cartItemId} // delete pesanan dalam cart
     GET localhost:8080/api/customers
     GET localhost:8080/api/customers/{id}
     GET localhost:8080/api/customers/{id}/cart // get cart by user id
     dst ada banyak liat2 aja dah awkookawkoaw pusing gw ini jam 1 malem kawkoawokawko wat
     why














































































































































is this shit even worth it?
  
