// Requerimientos de la estructura de trabajo
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require("mysql");
var app = express();

// requerimientos propios del sistema
var con = require('./System/app/system/connection');
var user = require('./System/app/User');
var cust = require('./System/app/Customer');


// configuracion para session con express
// app.use(express.cookieParser());
app.use(session({ 
	secret: '1234567890QWERTY',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}));


// configuracion para utilizar los parametros enviados desde el frontend
// por le metodo post
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
// configuracion para utilizar la libreria de plantillas de jade o pug
app.set('view engine', 'pug');

// configuracion para utilzar los archivos estaticos del proyecto
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/fonts',  express.static(__dirname + '/public/fonts'));
app.use('/style',  express.static(__dirname + '/public/css'));
app.use('/script',  express.static(__dirname + '/public/js'));


// configuraciones para las sesiones dentro del sistema
var sess;


// conecion con la base de datos.
var conec = con.connection();

conec.connect(function(err){
	if (err) {
		console.log('Error connection to Db '+err);
		return;
	}
	console.log('Connection established');
});


// Metodo para observar los usuario que existen en el sistema
app.get('/',function(req,res){
	user.read(function(resdata){
		res.render('home',{title:'Usuarios',datos:resdata});
	})
})

// Metodo para mostrar el detalle de un usuario segun su identificador
app.get('/user/:id',function(req,res){
	conec.query('SELECT * FROM USER WHERE ID_USER = ?',req.params.id,function(err,rows){
		if(err) throw err;
		// retornamos los datos al front end
		res.render('detail',{title:'Detalle de Usuario',user:rows});
	});
});


// Codigo para mostrar el formulario de nuevo usuario al front end
app.get('/new_user',function(req,res){
	sess = req.session;
	if (!sess.user) {
		res.render('frm_new_user',{title:"Nuevo Usuario"});
	} else {
		res.render('App/Conf/error',{title:"Iniciar Sesion"});
	}
})

// Codigo para mostrar el formulario de nuevo cunsimidor
app.get('/new_customer',function(req,res){
	res.render('App/Customer/create_customer',{title:"Nuevo Restaurante"});
})

// Metodo para guardar un usuario a la base datos
app.post('/save_user',function(req,response){
	var username = req.body.username;
	var lastname = req.body.lastname;
	var password = req.body.password;
	var email	 = req.body.email;
	// objeto que sera utilizado para almacenar la información
	var data = {
		USERNAME : username,
		USER_APELLIDO : lastname,
		USER_PASSWORD : password,
		USER_EMAIL	: email
	}

	// Consulta que almacenara los datos	
	user.create(data,function(res){
		console.log(res);
		if (res.state == true) {
			response.redirect('/');
		}
	});

})


// Metodo para eliminar un usuario del sistema
app.get('/del_user/:id',function(req,response){
	user.delete(req.params.id,function(resdata){
		if (resdata.state == true) {
			console.log('Registro Eliminado');
			response.redirect('/');
		}
	});
})


/****	****	****	****	****
		METODOS PARA FORMATOS JSON
****	****	****	****	****/
app.get('/user_json',function(req,res){
	conec.query('SELECT * FROM USER',function(err,rows){
		if(err) throw err;
		// retornamos los datos al front end
		res.json({user:rows});
	});
});





/****	****	****	****	****
		RUTAS PARA CUSTOMER 
****	****	****	****	****/

app.get('/customer',function(req,res){
	cust.read(function(resdata){
		res.render('App/Customer/read_customer',{title:'Restaurantes'});
	})
})

// codigo para correr el servidor dentro del puerto establecido
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});
