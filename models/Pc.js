const db = require('./db');

const Pc = db.sequelize.define('pc', {
	id: {
		type: db.Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nome: {
		type: db.Sequelize.STRING(255),
		allowNull: false
	},
	imagem: {
		type: db.Sequelize.STRING(255),
		allowNull: false
	},
	linguagem: {
		type: db.Sequelize.STRING(255),
		allowNull: false
	},
	ano: {
		type: db.Sequelize.INTEGER,
		allowNull: false
	},
	destaque: {
		type: db.Sequelize.INTEGER,
		allowNull: false
	},
	instalado: {
		type: db.Sequelize.INTEGER,
		allowNull: false
	},
	link: {
		type: db.Sequelize.TEXT
	},
	torrent: {
		type: db.Sequelize.TEXT
	},
	trailer: {
		type: db.Sequelize.TEXT
	},
	comprado: {
		type: db.Sequelize.TEXT
	},
	nota: {
		type: db.Sequelize.INTEGER,
		defaultValue: 0
	},
	obs: {
		type: db.Sequelize.TEXT
	},
	ativo: {
		type: db.Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false
	}
}, {
	charset: 'utf8mb3',
	collate: 'utf8mb3_unicode_ci',
	engine: 'MyISAM',
	defaultScope: {
		where: {
			ativo: 1
		}
	},
	scopes: {
		inativos: {
			where: {
				ativo: 0
			}
		},
		todos: {
			where: {}
		}
	}
});

module.exports = Pc;