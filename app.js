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
    {
        id : 3,
        name : "New User 1",
        email : "1234512345@12341234.com",
        password: "1234567898765432",
    },
    {
        id : 4,
        name : "New User 2",
        email : "12345678987654@12345.com",
        password: "123456765432",
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
        userId : 2,
    },
    {
        id : 3,
        content : "sampleContent3",
        imageUrl : "내용 1",
        userId : 3,
    },
    {
        id : 4,
        content : "sampleContent4",
        imageUrl : "내용 2",
        userId : 4,
    },
];



function posts_list (users, posts) {
    const lists = [];
    for (let i = 0 ; i < users.length ; i++){
          lists.push({
          "userId" : users[i].id,
          "userName" : users[i].name,
          "postingId" : users[i].id,
          "postingTitle" : posts[i].title,
          "postingImageUrl" : posts[i].imageUrl,
          "postingContent" : posts[i].content,        
            });
          };   
    const column = ['userId', 'userName', 'postingId', 'postingTitle', 'postingImageUrl', 'postingContent'];
  
      for (let k = 0 ; k < lists.length ; k++){
        for (let l = 0 ; l < column.length ; l++){
          if (lists[k][column[l]] === undefined){
          delete lists[k][column[l]];
        }
      }
    }
    return lists
  }

const posts_lists = {"data" : posts_list(users,posts)};

let listOfPosts = posts_list(users,posts);

const requestReceiver = function (request, response) {
    const { url, method } = request
    if (method === 'GET') {
        if (url === '/users_data'){
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify({message : users}));
        }
        else if (url === '/post_list'){
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify(posts_lists));
        };
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
        else if (url === '/posts'){
            let body = '';
            request.on('data', (data) => {body += data;})
            request.on('end', () => {
                const post = JSON.parse(body);

                posts.push({
                id : post.id,
                title : post.title,
                content : post.content,
                userID : post.userId
                })   
            
            response.end(JSON.stringify({message : "postCreated"}));
            })
        }
    }
    else if (method === 'PATCH') {
        if (url === '/posts_edited'){
            let body = '';
            request.on('data', (data) => {body += data;})
            request.on('end', () => {
                const edition = JSON.parse(body);
                
                for (let i = 0 ; i < users.length ; i++){
                    if (users[i].id === edition.postingId){
                        listOfPosts[i].postingContent = edition.postingContent;
                    };
                }
                response.writeHead(200, {'Content-Type' : 'application/json'});
                response.end(JSON.stringify(listOfPosts));
            });
        };
    };
}

server.on("request", requestReceiver)

// const IP = '127.0.0.1'
const PORT = 8000

server.listen(PORT, function() {
    console.log(`Listening to request on & port ${PORT}`)
})
