var express = require('express');
var pgp =require('pg-promise')();
var db = pgp('postgres://ahxdfxkfgsaqis:548016ebe41fd7a414af39170d5e3455aba9eab191f150bf9055d3e3f54723a8@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d9iij409sspnat?ssl=true')
var app = express();
var moment = require('moment');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/index', function (req, res) {
    res.render('pages/index');
});
//product
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products order by id ASC';
    if (id) {
        sql += ' where id =' + id + 'order by id ASC';
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//user
app.get('/users', function (req, res) {
    //res.download('./static/index.html');
    //res.redirect('/about'); var pgp =require('pg-promise');
    var id = req.param('id');
    var sql = 'select * from users  order by id ASC';
    if (id) {
        sql += ' where id =' + id + 'order by id ASC';
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
//productpid
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where id =" + pid + 'order by id asc';

    db.any(sql)
        .then(function (data) {

            res.render('pages/product_edit', { product: data[0], time: times });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});
//user pid
app.get('/users/:pid', function (req, res) {
    var pid = req.params.pid;
    var times = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where id =" + pid;

    db.any(sql)
        .then(function (data) {

            res.render('pages/user_edit', { user: data[0], time: times });

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })

});

//update product_edit
app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products set title = '${title}',price = '${price}' where id = '${id}' `;
    //db.none
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

//add product 
app.get('/addproduct', function (req, res) {
    res.render('pages/addproduct');
})
app.post('/addproduct', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id, title, price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})



var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});
