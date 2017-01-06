// Funcionamiento beta 
// 	siguiente fase utilizando completamente ReactJS
// @author codemario

// Script para validación de formulario de Nuevos Usuarios
$(function(){

	$("#frmNewUser").submit(function(e){
		e.preventDefault();
		
		$.post($(this).attr('action'),$(this).serialize(),function (resp){
			console.log(resp);
		},'json').fail(function(){
			console.log("Error Solicitud al Servidor.");
		});

	});
});