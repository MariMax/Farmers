var passport = require('passport');
var _hash = require('../helpers/commonHelpers.js').hash;
var generatePass = require('../helpers/commonHelpers.js').generatePass;
var User = require('../models/user.js').User;

	function login(req, res, next) {
  		passport.authenticate('local',
    		function(err, user, info) {
      			return err 
	        		? next(err)
        			: user
          			? req.logIn(user, function(err) {
	              		return err
                			? next(err)
                			: res.json(200,{loggedIn:true, token:user.token});
            		})
            	: res.json(401,{loggedIn:false});
    		}
  		)(req, res, next);
	};

// Здесь все просто =)
	function logout(req, res) {
    var token = req.headers['x-access-token'];
      if (token)
        User.dropToken(token);
      
  		req.logout();
 		  res.json(200,{logout:true})
	};

// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
	function register(req, res, next) {
		var salt = Date.now().toString();
		salt = _hash(conf.secret,salt);
    var pass = generatePass(conf.minPassLength);
    console.log(pass);
		var hash = _hash(salt,pass);
    var cityId = null;
    if (req.body.cityId) cityId = req.body.cityId.cityId
 		var user = new User({ email: req.body.email, hash: hash, salt:salt, name:req.body.name, surname:req.body.surname, phone:req.body.phone, cityId:cityId});
 		
  		user.save(function(err, user) {
    		return err
      			? next(err)
      			: req.logIn(user, function(err) {
        			return err
          			? next(err)
          			: res.json(200,{loggedIn:true, token:user.token})
      			});
  		});
	};

exports.add_routes = function(app){

	app.post('/signIn',login);

	app.post('/signUp',register);

	app.get('/logout',logout);

}