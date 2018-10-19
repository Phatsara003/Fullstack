var express = require('express');
var pgp =require('pg-promise')();
var db = pgp('postgres://ahxdfxkfgsaqis:548016ebe41fd7a414af39170d5e3455aba9eab191f150bf9055d3e3f54723a8@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d9iij409sspnat?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 



//app.get('/test', function (request, respone) {
//  //  respone.send('<H1>test</H1>');
//});

//app.use(express.static('static'));
app.set('view engine','ejs'); //??? ejs ???????????

app.get('/', function (req, res) {
     res.render('pages/index');
 });

 app.get('/about', function (req, res) {
     var name = 'Phatsara Ruangrat.';
     var hobbies = ['Music','Movie','Programming'];
     var bdate ='10/07/1997';
    res.render('pages/about',{ fullname : name , hobbies : hobbies,bdate : bdate });
});

app.get('/products', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id ='+id+' order by id ASC';
        }
    db.any(sql+' order by id ASC')
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/products',{products:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});

app.get('/products/:pid', function (req, res) {
 var pid = req.params.pid;
 var sql ="select * from products where id = "+ pid;
        
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/product_edit',{product:data[0]})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});


app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id ='+id;
    }
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/users',{users:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});
//user
app.get('/users', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where id ='+id;
        }
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/users',{users:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});

//Update data 
app.post('/product/update',function(req,res){
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql =`update products set title = '${title}',price='${price}' where id = '${id}'` ;
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
      res.redirect('/products')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});
//Update user 
app.post('/user/update',function(req,res){
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql =`update users set title = '${title}',price='${price}' where id = '${id}'` ;
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
      res.redirect('/users')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});

//add prpduct 
app.get('/addnew',function(req,res){
    res.render('pages/addnewproduct');

})
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql =`add products set title = '${title}',price='${price}' where id = '${id}'` ;
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
      res.redirect('/products')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
