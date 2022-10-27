const http = require("http");
const server = http.createServer();

const users = [
    {
        id : 1,
        name : "Rebekah Johnson",
        email : "Glover12345@gmail.com",
        password: "123qwe",
    },
    {
        id : 2,
        name : "Fabian Predovic",
        email : "Connell29@gmail.com",
        password : "password",
    },
];
const posts = [
    {
        id : 1,
        title : "간단한 HTTP API 개발 시작!",
        content : "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현",
        userId : 1,
    },
    {
        id : 2,
        title : "HTTP의 특성",
        content : "Request/Response와 Stateless!!",
        userId : 1,
    },
];

const requestReceiver = function (request, response) {
    const { url, method } = request
      if (method === 'GET') {
            if (url === '/users_data'){
              response.writeHead(200, {'Content-Type' : 'application/json'});
              response.end(JSON.stringify({message : users}));
            }
        } 
      else if (method === 'POST') { // (3)
          if (url === '/signup') {
              let body = ''; // (4)
              request.on('data', (data) => {body += data;})
              
              request.on('end', () => {  // (6)
                  const user = JSON.parse(body); //(7) 
  
                  users.push({ // (8)
                      id : user.id,
                      name : user.name,
                      email: user.email,
                      password : user.password
                  })
  
                  response.end(JSON.stringify({message : "userCreated"}));
              })
          }
    }
  };

server.on("request", requestReceiver)

const IP = '127.0.0.1'
const PORT = 8000

server.listen(PORT, IP, function() {
    console.log(`Listening to request on ip ${IP} & port ${PORT}`)
})
