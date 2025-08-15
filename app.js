/* -----------------------INSTRUÇÕES----------------------- /

Vou utilizar o Sequelize no lugar do Mongoose porque quero usar o MySQL aqui.

/ -----------------------INSTRUÇÕES----------------------- */

//console.log( 'Comando: node app.js' ); //Comando sem nodemon
console.log( 'Comando: nodemon app.js' );

/*Start - IMPORTS*/
const express = require("express");
const { engine } = require("express-handlebars");
const handlebars = require("handlebars");
const bodyParser = require("body-parser");
const admin = require("./routes/admin");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const flash = require("connect-flash");
const Pc = require("./models/Pc");
const Postagens = require("./models/Postagens");
/*End - IMPORTS*/

/*Start - CONFIG*/
const app = express(); //express

app.use(session({
	secret: 'blognode',
	resave: true,
	saveUninitialized: true
})); //express-session
app.use(flash()); //connect-flash

app.use(( req, res, next ) => {
	res.locals.success_msg = req.flash('success_msg'),
	res.locals.error_msg = req.flash('error_msg'),
	next()
}); //Mensagens de Sucesso e Erro ao logar

app.use(bodyParser.urlencoded({extended: true})); //bodyParser
app.use(bodyParser.json());

app.engine('handlebars', engine({
	defaultLayout: 'main',
	helpers: {
		// Helper para carregar CSS
		inlineStyles: function() {
			const cssDir = path.join(__dirname, 'public', 'css');
			let styles = '';
			
			// Lista de arquivos CSS que você quer incluir (na ordem desejada)
			const cssFiles = [
				'dinamico.css', 
				'root.css', 
				'global.css', 
			];
			
			cssFiles.forEach(file => {
				const filePath = path.join(cssDir, file);
				if (fs.existsSync(filePath)) {
					styles += fs.readFileSync(filePath, 'utf8');
				}
			});
			
			return new handlebars.SafeString(`<style>${styles}</style>`); // Corrigido usando handlebars importado
		},
		
		// Helper para carregar JS
		inlineScripts: function() {
			const jsDir = path.join(__dirname, 'public', 'js');
			let scripts = '';
			
			// Lista de arquivos JS que você quer incluir (na ordem desejada)
			const jsFiles = [
				'motor.js', 
			];
			
			jsFiles.forEach(file => {
				const filePath = path.join(jsDir, file);
				if (fs.existsSync(filePath)) {
					scripts += fs.readFileSync(filePath, 'utf8');
				}
			});
			
			// Helper para gerar range de números
			handlebars.registerHelper('range', function(start, end) {
				const result = [];
				for (let i = start; i <= end; i++) {
					result.push(i);
				}
				return result;
			});

			// Helper para comparação
			handlebars.registerHelper('eq', function(a, b) {
				return a === b;
			});

			return new handlebars.SafeString(`<script>${scripts}</script>`); // Corrigido usando handlebars importado
		}
	}
})); //handlebars
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public'))); //Pasta public (arquivos estáticos CSS, JS e Imagens)
/*End - CONFIG*/

/*Start - ROTAS*/
app.get('/', async (req, res) => {
	try {
		// Busca jogos PC ativos (limitando a 6)
		const pcs = await Pc.findAll({
			where: { ativo: 1 },
			order: [['destaque', 'DESC'], ['id', 'DESC']],
			limit: 6,
			raw: true
		});

		// Busca postagens ativas (limitando a 3)
		const postagens = await Postagens.findAll({
			where: { ativo: 1 },
			order: [['createdAt', 'DESC']],
			limit: 3,
			raw: true
		});

		res.render('index', { 
			pcs: pcs,
			postagens: postagens
		});
		
	} catch (erro) {
		console.error('Erro ao carregar a home:', erro);
		res.status(500).render('index', { 
			pcs: [],
			postagens: [],
			error_msg: 'Erro ao carregar conteúdo'
		});
	}
});

app.use('/admin', admin); //Admin do site (CMS)

app.get('/404', (req, res) => {
	req.flash('error_msg', 'Erro 404!');
	res.redirect('/');
});

app.get('/postagem/:id', async (req, res) => {
	try {
		const postagem = await Postagens.findOne({
			where: { 
				id: req.params.id,
				ativo: 1  // Só busca postagens ativas
			},
			raw: true  // Retorna como objeto simples
		});

		if (postagem) {
			// Formata a data antes de enviar para a view
			const postagemFormatada = {
				...postagem,
				data: new Date(postagem.createdAt).toLocaleDateString('pt-BR')
			};
			res.render('postagem/index', { postagem: postagemFormatada });
		} else {
			req.flash('error_msg', 'Esta postagem não existe ou foi desativada.');
			res.redirect('/');
		}
	} catch (erro) {
		console.error('Erro ao buscar postagem:', erro);
		req.flash('error_msg', 'Erro ao carregar postagem.');
		res.redirect('/');
	}
});

app.get('/postagens', async (req, res) => {
	try {
		
		const postagens = await Postagens.findAll({
			where: { 
				ativo: 1  // Só busca postagens ativas
			},
			raw: true  // Retorna como objeto simples
		});
		
		res.render('postagens/index', {postagens: postagens});
		
	} catch (erro) {
		console.error('Erro ao buscar listagem:', erro);
		req.flash('error_msg', 'Erro ao carregar listagem.');
		res.redirect('/');
	}
});

app.get('/teste', (req, res) => {
	res.send( 'Teste' );
});
/*End - ROTAS*/

/*Start - SERVIDOR*/
const porta = 8081;
app.listen(porta, () => {
	console.log('Servidor rodando na porta 8081 - http://localhost:8081');
});
/*End - SERVIDOR*/