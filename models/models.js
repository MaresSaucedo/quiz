var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite  DATABASE_URL = SQLITE://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6]||null);
var user      = (url[2]||null);
var pwd       = (url[3]||null);
var protocol  = (url[1]||null);
var dialect   = (url[1]||null);
var port      = (url[5]||null);
var host      = (url[4]||null);
var storage   = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQlite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  {
    dialect: protocol,
    protocol:protocol,
    port:    port,
    host:    host,
    storage: storage, // solo SQLite (.env)
    omitNull:true     // solo Postgres
   }
   );

//usar BBDD SQLite:
//var sequelize = new Sequelize(null, null, null,
//                       {dialect: "sqlite", storage: "quiz.sqlite"}
//                    );

// Importar la definicion de la table Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);


// Importar definicion de la tabla Comment
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

Quiz.belongsTo(User);
User.hasMany(Quiz);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);


//exports.Quiz = Quiz; // exportar definicion de table Quiz
//exports.Comment = Comment;
// los quizes pertenecen a un usuario registrado
// exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;
exports.User = User;
// sequelize.sync() crea e inicializa tabla con preguntas en DB
sequelize.sync().then(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
//  Quiz.count().then(function(count){

  User.count().then(function (count){

    if(count === 0) { //la tabla se inicializa solo si está vacía
//      Quiz.create({ pregunta: 'Capital de Italia',
//                    respuesta: 'Roma',
//                    tema: 'Geografia'
      User.bulkCreate(
        [ {username: 'admin',   password: '1234', isAdmin: true},
          {username: 'pepe',   password: '5678'} // el valor por defecto de isAdmin es 'false'
          ],{ fields: ['username'] }
//                  });
//      Quiz.create({ pregunta: 'Capital de Portuga',
//                    respuesta: 'Lisboa',
//                   tema: 'Geografia'
//                  })
//       .then(function(){console.log('Base de datos inicializada')});
      ).then(function(){
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.bulkCreate(
              [ {pregunta: 'Matriz Ejemplo',   respuesta: 'ejemplo', tema: 'Predial y Catastro', UserId: 1} // estos quizes pertenecen al usuario pepe (2)
              ]
            ).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
          };
        });
      });
    };
  });
});

