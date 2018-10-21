var express = require('express');
var pgp =require('pg-promise')();
var db = pgp('postgres://jcdfmzgcegkkxy:1cc0dec1ae4fa101a6fc4696b090b7b90f0f3847eb819bba2c969986f380b44e@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d51ai2ptaqnqhd?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
var moment = require('moment');
moment().format();

app.set('view engine','ejs'); //??? ejs ???????????

app.get('/', function (req, res) {
     res.render('pages/index');
 });
//about
 app.get('/about', function (req, res) {
     var name = 'Phatsara Ruangrat.';
     var id = '590213003';
     var major ='Software Engineering';
    res.render('pages/about',{ fullname : name , id : id,major : major });
});


//productpid
app.get('/products/:pid', function (req, res) {
 var pid = req.params.pid;
 var times = moment().format('MMMM Do YYYY, h:mm:ss a');
 var sql ="select * from products where product_id = "+ pid;
        
    db.any(sql)
    .then(function(data){
        //console.log('DATA:'+data);
        res.render('pages/product_edit',{product:data[0], time: times})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});
//product
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where products =' + id + ' ORDER BY product_id ASC';
    }
    db.any(sql + ' ORDER BY product_id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data });

        })
        .catch(function (data) {
            console.log('ERROR:' + console.error);

        })

});



//userid
app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql ="select * from users where users_id = "+ id;
           
       db.any(sql)
       .then(function(data){
           console.log('DATA:'+data);
           res.render('pages/user_edit',{user:data[0],time:times})
           
       })
       .catch(function(error){
           console.log('ERROR:'+error);
           
       })
   });
//user
app.get('/users', function (req, res) {

    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where users =' + id + ' ORDER BY users_id ASC';
    }
    db.any(sql + ' ORDER BY users_id ASC')
        .then(function (data) {
            console.log('DATA:' + data);
        res.render('pages/users',{users:data})
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })

});


//update product
app.post('/product/update',function(req,res){
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql =`update products set title = '${title}',price='${price}' where product_id = '${id}'` ;
    db.any(sql)
    .then(function(data){
        console.log('DATA:'+data);
      res.redirect('/products')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});

//update user
app.post('/user/update',function(req,res){
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var sql =`update users set password = '${password}',email='${email}' where users_id = '${id}'` ;
    db.any(sql)
    .then(function(data){   
      res.redirect('/users')
        
    })
    .catch(function(error){
        console.log('ERROR:'+error);
        
    })
});


//add product 
app.get('/product_add', function (req,res) {
    var time = moment().format();
    res.render('pages/product_add', { time: time});
})
app.post('/products/product_add', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var time = req.body.time;
    var sql = `INSERT INTO products (product_id, title, price, created_at)
    VALUES ('${id}', '${title}', '${price}', '${time}')`;
   
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})


//add user 
app.get('/user_add', function (req,res) {
    var time = moment().format();
    res.render('pages/user_add', { time: time});
})
app.post('/users/user_add', function (req,res) {
    var id = req.body.id;
    var email = req.body.email;
    var password = req.body.password;
    var time = req.body.time;
    var sql = `INSERT INTO users (users_id, email, password, created_at)
    VALUES ('${id}', '${email}', '${password}', '${time}')`;
    //db.none
    // console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})

//delete product 
app.get('/product_delete/:id', function (req,res) {
    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where product_id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//delete user
app.get('/user_delete/:id', function (req,res) {
    var id = req.params.id;
    var sql = 'DELETE FROM users';
    if (id) {
        sql += ' where users_id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/users');

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//reportpro
app.get('/product_report', function (req, res) {
    var id = req.param('id');
    var sql = 'select* from products ORDER BY Price ASC limit 5';
    if (id) {
        sql += ' where product =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/product_report', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//reprotuser
app.get('/user_report', function(req, res) {
    var sql='select purchases.users_id,purchases.name,users.email,sum(purchase_items.price) as price from purchases inner join users on users.users_id=purchases.users_id inner join purchase_items on purchase_items.purchase_id=purchases.purchase_id group by purchases.users_id,purchases.name,users.email order by sum(purchase_items.price) desc LIMIT 15;'
    db.any(sql)
        .then(function (data) 
        {
            //f
            // console.log('DATA' + data);
            res.render('pages/Report_users', { users : data });
        })
        .catch(function (data) 
        {
            console.log('ERROR' + error);
        })
});
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
