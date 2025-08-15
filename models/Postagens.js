const db = require('./db');

const Postagens = db.sequelize.define('postagens', {
	id: {
		type: db.Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ativo: {
		type: db.Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false
	},
	titulo: {
		type: db.Sequelize.STRING(255),
		allowNull: true
	},
	conteudo: {
		type: db.Sequelize.TEXT,
		allowNull: true
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

module.exports = Postagens;