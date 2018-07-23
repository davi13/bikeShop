var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_kojNshfD6DGrDxxXg4ceYnph");

var email = 'davi@mon.mail';
var userName = 'davi';
var password = '123456';
var bikes = [
  {name: 'Model BIKO45', url: '/images/bike-1.jpg',price: 679},
  {name: 'Model ZOOK7', url: '/images/bike-2.jpg',price: 799},
  {name: 'Model LIKO89', url: '/images/bike-3.jpg',price: 839},
  {name: 'Model GEWO', url: '/images/bike-4.jpg',price: 1206},
  {name: 'Model TITAN5', url: '/images/bike-5.jpg',price: 989},
  {name: 'Model AMIG39', url: '/images/bike-1.jpg',price: 599}

];
//var shopBasket = [];




/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.shopBasket == undefined) {
    
    req.session.shopBasket = [];
  }
  res.render('index', {bikes:bikes, isLogged: req.session.isLogged,shopBasket:req.session.shopBasket});
});

/**************ADD BASKET********************** */

router.post('/shop', function(req, res, next){

  console.log('req.body ===>', req.body);

  req.session.shopBasket.push(req.body);

  res.render('shop',{shopBasket : req.session.shopBasket});
  console.log('hello', req.session.shopBasket);

});

/*****************DELETE****************** */
router.get('/delete', function(req,res, next){

  req.session.shopBasket.splice(req.query.position,1);

  res.render('shop',{shopBasket:req.session.shopBasket})

});
/****************LOGG-IN********************* */
router.get('/loggin', function(req, res, next){
  res.render('loggin',{})
});

router.post('/loggin', function(req,res, next){

  console.log('req.body ===>', req.body);

  if(req.body.email == email && req.body.userName == userName && req.body.password == password){

    req.session.isLogged = true;

    res.render('index',{bikes : bikes, isLogged: req.session.isLogged});

  } else {
    req.session.isLoggedIn = false;

    res.render('loggin');
  }
  
});
/*****************LOGG-OUT*************************** */
router.get('/logginout',function(req, res, next){

    req.session.isLogged = false;

    res.render('index', {bikes:bikes, isLogged: req.session.isLogged})

});
/*****************UPDATE******************************** */
router.post('/updateQuantity',function(req,res, next){

  console.log('request.body===>', req.body)

  req.session.shopBasket[req.body.position].quantity = req.body.quantity;
  
   res.render('shop',{shopBasket:req.session.shopBasket});
});

/********************PAYEMENT******************************* */

router.post('/payment',function(req,res,next){

  var totalCmd = 0;
  
 var productList = {};

  for (var i = 0; i < shopBasket.length; i++) {

  productList[shopBasket[i].name] = shopBasket[i].quantity;

  }



  for (var i = 0; i < shopBasket.length; i++) {

    totalCmd = totalCmd + (shopBasket[i].price * shopBasket[i].quantity*100); 

  }

  const token = req.body.stripeToken; // Using Express
  const charge = stripe.charges.create({
  amount: totalCmd,
  currency: 'eur',
  description: 'Example charge',
  source: token,
  metadata: productList
});

  res.render('index',{bikes:bikes, isLogged: req.session.isLogged});
});


module.exports = router;
