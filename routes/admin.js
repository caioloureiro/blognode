const express = require("express");
const router = express.Router();
const Pc = require("../models/Pc");
const Postagens = require("../models/Postagens");

// Helper para verificar se é número
function isNumber(value) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

// Página principal do admin
router.get('/', (req, res) => {
	res.render('admin/index');
});

/*Start - PC*/
router.get('/pc', (req, res) => {
	Pc.findAll({
		raw: true,
		nest: true,
		where: { ativo: 1 },
		order: [['id', 'DESC']]
	}).then((pcs) => {
		res.render('admin/pc', { pcs: pcs });
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao carregar jogos: ' + erro);
		res.redirect('/admin');
	});
});

router.get('/pc/add', (req, res) => {
	res.render('admin/pcAdd', { erros: [] });
});
router.post('/pc/add/set', (req, res) => {
	let erros = [];

	if (!req.body.nome || req.body.nome.length < 2) {
		erros.push({ text: 'Nome inválido' });
	}
	if (!req.body.imagem) {
		erros.push({ text: 'Imagem é obrigatória' });
	}
	if (!req.body.ano || !isNumber(req.body.ano)) {
		erros.push({ text: 'Ano inválido' });
	}

	if (erros.length > 0) {
		return res.render('admin/pcAdd', { erros: erros });
	}

	const dadosPc = {
		nome: req.body.nome,
		imagem: req.body.imagem,
		linguagem: req.body.linguagem || 'Português',
		ano: parseInt(req.body.ano),
		destaque: req.body.destaque === '1' ? 1 : 0,
		instalado: req.body.instalado === '1' ? 1 : 0,
		link: req.body.link || null,
		torrent: req.body.torrent || null,
		trailer: req.body.trailer || null,
		comprado: req.body.comprado || null,
		nota: parseInt(req.body.nota) || 0,
		obs: req.body.obs || null,
		ativo: 1
	};

	Pc.create(dadosPc)
		.then(() => {
			req.flash('success_msg', 'Jogo adicionado com sucesso');
			res.redirect('/admin/pc');
		})
		.catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar: ' + erro.message);
			res.redirect('/admin/pc/add');
		});
});

router.get('/pc/editar/:id', (req, res) => {
	Pc.findOne({
		where: { 
			id: req.params.id,
			ativo: 1
		}
	}).then((pc) => {
		if (!pc) {
			req.flash('error_msg', 'Jogo não encontrado ou já desativado');
			return res.redirect('/admin/pc');
		}

		const pcData = pc.get({ plain: true });
		pcData.destaque = pcData.destaque ? '1' : '0';
		pcData.instalado = pcData.instalado ? '1' : '0';

		res.render('admin/pcEdit', {
			pc: pcData,
			erros: []
		});
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao carregar jogo: ' + erro);
		res.redirect('/admin/pc');
	});
});
router.post('/pc/editar/set/:id', (req, res) => {
	let erros = [];

	if (!req.body.nome || req.body.nome.length < 2) {
		erros.push({ text: 'Nome inválido' });
	}
	if (!req.body.imagem) {
		erros.push({ text: 'Imagem é obrigatória' });
	}
	if (!req.body.ano || !isNumber(req.body.ano)) {
		erros.push({ text: 'Ano inválido' });
	}

	if (erros.length > 0) {
		return Pc.findOne({ where: { id: req.params.id } })
			.then((pc) => {
				const pcData = pc.get({ plain: true });
				pcData.destaque = pcData.destaque ? '1' : '0';
				pcData.instalado = pcData.instalado ? '1' : '0';
				
				res.render('admin/pcEdit', {
					pc: pcData,
					erros: erros
				});
			});
	}

	const dadosAtualizados = {
		nome: req.body.nome,
		imagem: req.body.imagem,
		linguagem: req.body.linguagem,
		ano: parseInt(req.body.ano),
		destaque: req.body.destaque === '1' ? 1 : 0,
		instalado: req.body.instalado === '1' ? 1 : 0,
		link: req.body.link || null,
		torrent: req.body.torrent || null,
		trailer: req.body.trailer || null,
		comprado: req.body.comprado || null,
		nota: parseInt(req.body.nota) || 0,
		obs: req.body.obs || null,
		//ativo: req.body.ativo === '1' ? 1 : 0
	};

	Pc.update(dadosAtualizados, {
		where: { id: req.params.id }
	}).then(() => {
		req.flash('success_msg', 'Jogo atualizado com sucesso');
		res.redirect('/admin/pc');
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao atualizar: ' + erro.message);
		res.redirect(`/admin/pc/editar/${req.params.id}`);
	});
});

router.get('/pc/excluir/:id', (req, res) => {
	Pc.update(
		{ ativo: 0 },
		{ 
			where: { 
				id: req.params.id,
				ativo: 1
			} 
		}
	).then(() => {
		req.flash('success_msg', 'Jogo desativado com sucesso');
		res.redirect('/admin/pc');
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao desativar: ' + erro.message);
		res.redirect('/admin/pc');
	});
});
/*End - PC*/

/*Start - Postagens*/
router.get('/postagens', (req, res) => {
	Postagens.findAll({
		raw: true,
		nest: true,
		where: { ativo: 1 },
		order: [['id', 'DESC']]
	}).then((postagens) => {
		res.render('admin/postagens', { postagens: postagens });
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao carregar postagens: ' + erro);
		res.redirect('/admin');
	});
});

router.get('/postagens/add', (req, res) => {
	res.render('admin/postAdd', { erros: [] });
});
router.post('/postagens/add/set', (req, res) => {
	let erros = [];

	if (!req.body.titulo || req.body.titulo.length < 2) {
		erros.push({ text: 'Título inválido.' });
	}
	if (!req.body.conteudo) {
		erros.push({ text: 'Conteúdo vazio.' });
	}

	if (erros.length > 0) {
		return res.render('admin/postAdd', { erros: erros });
	}

	const dadosPost = {
		titulo: req.body.titulo,
		conteudo: req.body.conteudo || null,
		ativo: 1
	};

	Postagens.create(dadosPost)
		.then(() => {
			req.flash('success_msg', 'Postagem adicionada com sucesso');
			res.redirect('/admin/postagens');
		})
		.catch((erro) => {
			req.flash('error_msg', 'Erro ao salvar: ' + erro.message);
			res.redirect('/admin/postagens/add');
		});
});

router.get('/postagens/editar/:id', (req, res) => {
	Postagens.findOne({
		where: { 
			id: req.params.id,
			ativo: 1
		}
	}).then((postagem) => {
		
		if (!postagem) {
			req.flash('error_msg', 'Postagem não encontrada ou já desativada');
			return res.redirect('/admin/postagens');
		}

		const postagemData = postagem.get({ plain: true });

		res.render('admin/postEdit', {
			postagem: postagemData,
			erros: []
		});
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao carregar postagem: ' + erro);
		res.redirect('/admin/postagens');
	});
});
router.post('/postagens/editar/set/:id', (req, res) => {
	let erros = [];

	if (!req.body.titulo || req.body.titulo.length < 2) {
		erros.push({ text: 'Título inválido' });
	}
	if (!req.body.conteudo || req.body.conteudo.length < 2) {
		erros.push({ text: 'Conteúdo inválido' });
	}

	if (erros.length > 0) {
		return Postagens.findOne({ where: { id: req.params.id } })
			.then((postagens) => {
				const postagensData = postagens.get({ plain: true });
				
				res.render('admin/postEdit', {
					postagens: postagensData,
					erros: erros
				});
			});
	}

	const dadosAtualizados = {
		titulo: req.body.titulo,
		conteudo: req.body.conteudo || null,
	};

	Postagens.update(dadosAtualizados, {
		where: { id: req.params.id }
	}).then(() => {
		req.flash('success_msg', 'Postagem atualizada com sucesso');
		res.redirect('/admin/postagens');
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao atualizar: ' + erro.message);
		res.redirect(`/admin/postagens/editar/${req.params.id}`);
	});
});

router.get('/postagens/excluir/:id', (req, res) => {
	Postagens.update(
		{ ativo: 0 },
		{ 
			where: { 
				id: req.params.id,
				ativo: 1
			} 
		}
	).then(() => {
		req.flash('success_msg', 'Postagem desativada com sucesso');
		res.redirect('/admin/postagens');
	}).catch((erro) => {
		req.flash('error_msg', 'Erro ao desativar: ' + erro.message);
		res.redirect('/admin/postagens');
	});
});
/*End - Postagens*/

module.exports = router;