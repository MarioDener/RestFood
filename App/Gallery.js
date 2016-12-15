var con = require('./system/connection');
var conec = con.connection();

module.exports = {
	create: function(data,callback){
		setTimeout(function(){
			conec.query('INSERT INTO GALLERY SET ?', data, function(err,res){
				if(err) throw err;

				var rsdata = {state:true, data:res.insertId};				
				callback(rsdata);
			});
		}, 500);
	},
	read: function(callback){
		setTimeout(function(){
			conec.query('SELECT * FROM GALLERY',function(err,rows){
				if(err) throw err;
				// retornamos los datos al frontend
				callback(rows);				
			});
		}, 100);
	},
	update: function(){

	},
	delete: function(key,callback){
		setTimeout(function(){
			conec.query('DELETE FROM GALLERY WHERE ID_GALERIA = ?',key,function(err,res){
				if (err) throw err;
				callback({state:true});
			})
		}, 100);

	},
	detail: function(data,callback){
		setTimeout(function(){
			conec.query('SELECT * FROM GALLERY WHERE ID_GALERIA = ?',data,function(err,rows){
				if(err) throw err;
				// retornamos los datos al front end
				callback(rows);				
			})
		}, 100);
	},
	detailCustomer: function(data,callback){
		setTimeout(function(){
			conec.query('SELECT * FROM GALLERY WHERE ID_CUSTOMER = ?',data,function(err,rows){
				if(err) throw err;
				// retornamos los datos al front end
				callback(rows);				
			})
		}, 100);
	},
}