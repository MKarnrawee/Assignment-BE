var express = require('express');
var app = express();
var fs = require("fs");
app.use(express.json()); //Used to parse JSON bodies
const axios = require('axios').default;

var server = app.listen(8000, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Application Run At http://%s:%s", host, port)
});

var loginstatus = 0;

app.post('/login', function(req,res){
    console.log(req.body) //{"username":"john.doe","password":"thisismysecret"}
    if(req.body.username == 'john.doe' && req.body.password == 'thisismysecret'){
        res.status(200)
        res.end("logged in!")
        loginstatus = 1
    }
    else{
        res.status(404)
        res.end("fail")
    }
});

app.get('/users', function(req, res){
    if(loginstatus==1){ //required login
        fs.readFile(__dirname + "/" + "user.json", 'utf8', function(err, data){
            console.log(data);
            res.end(data);
        });
    }
    else{
        res.end("please login")
    }
});


app.post('/users', function(req,res){
    var users = []
    fs.readFile(__dirname + "/" + "user.json", 'utf8', function(err,data){
        users = JSON.parse(data)
        var newuser = req.body //{"username":"john.doe","password":"thisismysecret","date_of_birth":"15/01/1985"}
        users.user.push(newuser)
        console.log(users)
        var addeduser = JSON.stringify(users)
        fs.writeFile(__dirname + "/" + "user.json", addeduser, function(err,addeduser){
            if(err){
                console.log("err",err)
            }
            else{
                res.status(200)
                res.end(JSON.stringify(addeduser));
            }    
        });
    });
});

app.post('/users/orders',async function(req,res){
    var allbook = await axios.get('https://scb-test-book-publisher.herokuapp.com/books')
    var bookdata = allbook.data
    var getorder = req.body.orders //{"orders":[1,4]}
    var sumprice = 0
    
    console.log(getorder)
    if(loginstatus==1) //required login
    {
        for(var i=0; i<bookdata.length; i++)
        {
            for(var j=0; j<getorder.length; j++)
            if(bookdata[i].id==getorder[j])
            {
                sumprice += bookdata[i].price
            }
        }
        var price = {price : sumprice}
        console.log(price)
        res.end(JSON.stringify(price))
    }
    else
    {
        res.end("please login")
    }
});

app.get('/books',async function(req, res){
    
    var allbook = await axios.get('https://scb-test-book-publisher.herokuapp.com/books')
    var recommendbook = await axios.get('https://scb-test-book-publisher.herokuapp.com/books/recommendation')
    allbook.data.sort(function(a,b){
        var nameA = a.book_name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.book_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      })
    recommendbook.data.sort(function(a,b){
        var nameA = a.book_name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.book_name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      })

    books = recommendbook.data.concat(allbook.data)
    var result = []
    var result1 = []
    
    for(var i=0; i<books.length; i++)
    {
        if(!result.includes(JSON.stringify(books[i])))
        {
            result.push(JSON.stringify(books[i]))
            result1.push(books[i])
        }
    }
    var result2 = {books : result1}
    console.log(result2)
    res.end(JSON.stringify(result2))
});



