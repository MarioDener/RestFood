// Requerimientos de la estructura de trabajo
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require("mysql");


// 1er opcion de subir imagenes con nodejs
var path = require('path');
var formidable = require("formidable");
var fs = require('fs');

// 2da opcion para subir imagenes con node js
var multer  = require('multer')

var upload = multer({ dest: __dirname + '/public/resource/customer/'})
var uploadUserPhonto = multer({ dest: __dirname + '/public/resource/users/'})

// directorio para fotos de perfil y portada de un restaurante
var uploadRestPhotoProfile = multer({ dest: __dirname + '/public/resource/customer/'})

var app = express();


// requerimientos propios del sistema
var con = require('./App/system/connection');
var user = require('./App/User');
var cust = require('./App/Customer');
var gall = require('./App/Gallery');

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
app.use('/image',  express.static(__dirname + '/public/resource'));


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
		res.render('App/Dashboard/read_dash',{title:'Usuarios',datos:resdata});
	})
})

/****	****	****	****	****
		RUTAS PARA USER
****	****	****	****	****/
app.get('/users',function(req,res){
	user.read(function(resdata){
		res.render('App/User/read_users',{title:'Usuarios',datos:resdata});
	})
})


// Metodo para mostrar el detalle de un usuario segun su identificador
app.get('/user/:id',function(req,res){
	user.detail(req.params.id, function(restdata){
		res.render('App/User/detail_user',{title:'Detalle de Usuario',user:restdata});
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
// Metodo para guardar un usuario a la base datos
app.post('/save_user',uploadUserPhonto.single('user_photo'),function(req,response){
	var username = req.body.user_username;
	var name     = req.body.user_Name;
	var lastname = req.body.user_Lastname;
	var password = req.body.user_password;
	var email	 = req.body.user_email;
	// objeto que sera utilizado para almacenar la información
	var data = {
		USERNAME : username,
		USER_NOMBRE : name,
		USER_APELLIDO : lastname,
		USER_PASSWORD : password,
		USER_EMAIL	: email,
		USER_STATE : '0',
		USER_SESSION : '0'
	}
	// Consulta que almacenara los datos	
	user.create(data,function(res){
		console.log(res);
		if (res.state == true) {
			var file = __dirname + '/public/resource/users/' + res.data;
			fs.rename(req.file.path, file, function(err) {
			    if (err) {
			      console.log(err);
			      res.send(500);
			    } else {
			      console.log({message: 'File uploaded successfully',filename: res.data});
			    }
			});
			response.redirect('/users');
		}
	});
});

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

app.get('/customers',function(req,res){
	cust.read(function(resdata) {
		res.render('App/Customer/read_customer',{title:'Restaurantes',datos:resdata});
	})
});
// Codigo para mostrar el formulario de nuevo cunsimidor
app.get('/new_customer',function(req,res){
	res.render('App/Customer/create_customer',{title:"Nuevo Restaurante"});
});

// Metodo para guardar  un restaurante a la base datos
app.post('/save_customer',upload.single('foto_perfil'),function(req,response){
	var name = req.body.name;
	var password = req.body.password;
	var info = req.body.info;
	var place	 = req.body.place;
	var phone	 = req.body.phone;
	console.log(name);
	// objeto que sera utilizado para almacenar la información
	var data = {
		S_NAME : name,
		S_INFO : info,
		S_ADDRESS : place,
		N_PHONE	: phone,
		N_FUNDATOR: 1
	}
	console.log(req.file);
	// parse the incoming request containing the form data
	cust.create(data,function(res){
		var file = __dirname + '/public/resource/customer/' + res.data;
		fs.rename(req.file.path, file, function(err) {
		    if (err) {
		      console.log(err);
		      res.send(500);
		    } else {
		      console.log({message: 'File uploaded successfully',filename: res.data});
		    }
		});

		console.log(res);
		if (res.state == true) {
			response.redirect('/customers');
		}
	});	
});

// metodo para presentar los restaurantes en json
app.get('/customer_json',function(req,res){
	cust.read(function(resdata){
		var json = [];
		for (var i = resdata.length - 1; i >= 0; i--) {
			json.push({"name" : resdata[i].S_NAME,"info":resdata[i].S_INFO,"image":'http://localhost:3000/image/customer/'+resdata[i].ID_CUSTOMER,'followers':resdata[i].N_FOLLOWERS,"likes":resdata[i].N_LIKES});
		}
		// var data = JSON.parse(json);
		console.log(json);
		res.json({customers:json});
	})
});
// metodo para mostrar el detalle de un customer
app.get('/customer/:id', function(req,res){
	cust.detail(req.params.id,function(resdata){
		gall.detailCustomer(req.params.id,function(resdatag){
			console.log(resdatag);
			res.render('App/Customer/detail_customer',{
				title:'Detalle de Customer',
				user:resdata,
				galleries:resdatag
			});
		})
	});
});
// metodo para eliminar el consumidor 
app.get('/del_cus/:id',function(req,response){
	cust.delete(req.params.id,function(resdata){
		if (resdata.state == true) {
			console.log('Registro Eliminado');
			response.redirect('/customers');
		}
	});
});




/****	****	****	****	****
		RUTAS PARA GALERIA 
****	****	****	****	****/

// metodo para crear una galeria de imagenes dentro de un restaurante
app.post('/save_gallery', function(req,response) {
	var nombreGaleria = req.body.customer_name_gallery;
	var customer = req.body.customer_key;
	var data = { S_NOMBRE: nombreGaleria, ID_CUSTOMER: customer }
	gall.create(data,function(res){
		if (res.state == true) {
			response.redirect('/customers');
		}
	})
});



// codigo para correr el servidor dentro del puerto establecido
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});
