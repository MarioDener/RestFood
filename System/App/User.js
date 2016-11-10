var con = require('./system/connection');
var conec = con.connection();

module.exports ={
	create: function(data,callback){
		setTimeout(function(){
			conec.query('INSERT INTO USER SET ?', data, function(err,res){
				if(err) throw err;
				var rsdata = {state:true,data:res.insertId};				
				callback(rsdata);
			});
		}, 500);		
	},
	read: function(callback){
		setTimeout(function(){
			conec.query('SELECT * FROM USER',function(err,rows){
				if(err) throw err;
				// retornamos los datos al frontend
				callback(rows);				
			});
		}
		, 100);
	},
	delete: function(key,callback){
		setTimeout(function(){
			conec.query('DELETE FROM USER WHERE ID_USER = ?',key,function(err,res){
				if(err) throw err;
				callback({state:true});
			})
		}, 100);
	},
	update: function(data,callback){
		setTimeout(function(){
			callback('updated');
		}, 100);
	}
}