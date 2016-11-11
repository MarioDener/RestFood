var con = require('./system/connection');
var conec = con.connection();

module.exports = {
	create: function(data,callback){
		setTimeout(function(){
			conec.query('INSERT INTO CUSTOMER SET ?', data, function(err,res){
				if(err) throw err;
				var rsdata = {state:true,data:res.insertId};				
				callback(rsdata);
			});
		}, 500);
	},
	read: function(callback){
		setTimeout(function(){
			conec.query('SELECT * FROM CUSTOMER',function(err,rows){
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
			conec.query('DELETE FROM CUSTOMER WHERE ID_CUSTOMER = ?',key,function(err,res){
				if (err) throw err;
				callback({state:true});
			})
		}, 100);

	}
}