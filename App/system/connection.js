var mysql = require("mysql");

module.exports  = {
	// metodo para crear una coneccion a la base de datos
	connection : function() {
		var con = mysql.createConnection({
			host:"localhost",
			user:'root',
			password:'',
			database:'ARP'
		});
		
		return con;
	}
}

