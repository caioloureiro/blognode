const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	//'digi8353_catalogo', 
	'node', 
	'root', 
	'caio1234', 
	{
		host: "localhost",
		dialect: 'mysql'
	}
);

module.exports = {
	Sequelize: Sequelize,
	sequelize: sequelize
}

sequelize.authenticate().then(function(){
	console.log( 'Contectado ao MySQL' );
}).catch(function(erro){
	console.log( 'FALHA ao conectar com o MySQL. Erro: '+ erro );
});