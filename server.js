var express = require('express');
var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://jcdfmzgcegkkxy:1cc0dec1ae4fa101a6fc4696b090b7b90f0f3847eb819bba2c969986f380b44e@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d51ai2ptaqnqhd')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.render('pages/index');
});

app.get('/index',function(req,res){
    res.render('pages/index');
});

app.get('/about',function(req,res){
    var name = 'Phatsara Ruangrat';
    var hobbies = ['Music','Movie','Programming'];
    var bdate = '10/07/1977'
    res.render('pages/about',{fullname : name,hobbies : hobbies,bdate  });
});
// Display all products
app.get('/products', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id ='+id;
        }
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
        res.render('pages/products',{products:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});

app.get('/products/:pid',function(req,res){
    var pid = req.params.pid;
    var sql = "select * from products where id= " +pid;


    db.any(sql)
    .then(function(data){
res.render('pages/product_edit',{product : data[0]});
    })
    .catch(function(error){
        console.log('ERROR:'+error);
    })
});



    

app.get('/users/:id', function(req, res) {
var id = req.params.id;
var sql = 'select * from users';
    if(id){
        sql += ' where id ='+id;
    }
  db.any(sql)
  .then(function(data){
      console.log('DATA:' + data);
      res.render('pages/users',{users :data})

  })
  .catch(function(error){
    console.log('ERROR:'+ error);
})
});

  app.get('/users',function(req,res){
    db.any('select * from users',)
    .then(function(data){
        console.log('DATA:' + data);
        res.render('pages/users',{users :data})      
    })  

    .catch(function(error){
        console.log('ERROR:'+ error);
    })
     });                        



     //update
     app.post('/product/update',function(req,res){

        var id = req.body.id;
        var title = req.body.title;
        var price = req.body.price;
        var sql = `update product set title=${title},price=${price},where id =`
        //db.non
        console.log('UPDATE:' + sql);
        res.redirect('/products');
     });




     var port = process.env.PORT || 8080;
     app.listen(port, function() {
     console.log('App is running on http://localhost:' + port);
     });
