// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  	'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario"}}
      },
      publicado: {
      	type: DataTypes.BOOLEAN,
      	defaultValue: false
       },
      texto1: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario1"}}
      },
      texto2: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario2"}}
      },
      texto3: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario3"}}
      },
      texto4: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario4"}}
      },
      texto5: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario5"}}
      }
    }
  );
}

