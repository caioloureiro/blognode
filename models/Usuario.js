const db = require('./db');

const Usuario = db.sequelize.define('usuarios', {
	id: {
		type: db.Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ativo: {
		type: db.Sequelize.INTEGER,
		defaultValue: 1
	},
	nome: {
		type: db.Sequelize.STRING(255)
	},
	sobrenome: {
		type: db.Sequelize.STRING(255)
	},
	idade: {
		type: db.Sequelize.INTEGER
	},
	email: {
		type: db.Sequelize.STRING(255)
	},
	senha: {
		type: db.Sequelize.STRING(255),
		allowNull: false
	},
	createdAt: {
		type: db.Sequelize.DATE,
		allowNull: false
	},
	updatedAt: {
		type: db.Sequelize.DATE,
		allowNull: false
	}
}, {
	charset: 'utf8mb4',
	collate: 'utf8mb4_unicode_520_ci',
	engine: 'InnoDB',
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

module.exports = Usuario;