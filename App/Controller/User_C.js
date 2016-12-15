var express = require('express');
var router = express.Router();
var user = require('../User');

/****	****	****	****	****
		CONTROLADOR PARA USER
****	****	****	****	****/

router.get('/',function(req,res,next){
	user.read(function(resdata){
		res.render('App/User/read_users',{title:'Usuarios',datos:resdata});
	})
})


// Metodo para mostrar el detalle de un usuario segun su identificador
router.get('/user/:id',function(req,res){
	user.detail(req.params.id, function(restdata){
		res.render('App/User/detail_user',{title:'Detalle de Usuario',user:restdata});
	});
});

// Codigo para mostrar el formulario de nuevo usuario al front end
router.get('/new_user',function(req,res){
	sess = req.session;
	if (!sess.user) {
		res.render('frm_new_user',{title:"Nuevo Usuario"});
	} else {
		res.render('App/Conf/error',{title:"Iniciar Sesion"});
	}
})


module.exports = router;