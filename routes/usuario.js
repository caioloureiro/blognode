const express = require('express');
const router = express.Router();
const Usuario = require("../models/Usuario");

router.get('/registro', ( req, res ) => {

	res.render('usuarios/registro');
	
});

router.post('/registro', ( req, res ) => {

	var erros = [];
	
	//console.log( 'req.body', req.body );
	
	if( req.body.senha.length < 5 ){
		erros.push({texto: 'Senha muito pequena. Mínimo de 5 caracteres.'});
	}
	
	if( req.body.senha != req.body.confirmarSenha ){
		erros.push({texto: 'As senhas são diferentes. Tente novamente'});
	}
	
	if( erros.length > 0 ){
		
		res.render('usuarios/registro', {erros: erros});
		
	}
	else{
		
		Usuario.findOne({email: req.body.email}).then((usuario) => {
			
			if(usuario){
				req.flash('error_msg', 'Já existe uma conta com esse e-mail.');
				res.redirect('/registro');
			}
			else{
				
				
				
			}
			
		}).catch((err) => {
			req.flash('error_msg', 'Houve um erro interno');
			res.redirect('/');
		})
		
	}
	
});

module.exports = router;