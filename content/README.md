# To Run the project from local:

* Clone the project
* cd ringIDWeb
* Need to Run Server Projects
    - In `LoadbalancerForUDPServer` - set the `ringIDWeb` path as `contextPath` in `config.properties` file
    - In `UDPServer` - set the `ringIDWeb` path as `serverContextFolder` in `server.xml` file
* npm install (make sure node version is above 4)
* grunt local
* Browse http://localhost:8080/#/