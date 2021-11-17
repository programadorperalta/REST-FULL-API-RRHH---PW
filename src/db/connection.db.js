const mariadb = require('mariadb')//levanta el modulo mariadb de node_modules

const pool = mariadb.createPool({ //mariadb tiene el metodo createPool y crea un pool de conexion. 
    host: process.env.DB_HOST           ||'localhost',  //si no encuentra en env DB_HOST pone por defecto localhost y asi sucesivamente ↓ 
    user: process.env.DB_USER           ||'root', 
    password: process.env.DB_PASSWORD   ||'claveSecreta',
    database: process.env.DB_DATABASE   ||'rrhh_dev',
    connectionLimit: 5, //genera 5 conexiones todas con el mismo usuario y contraseña. 
});

module.exports=pool //y luego exportamos el pool. 