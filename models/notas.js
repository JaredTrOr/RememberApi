module.exports = (sequelize, type) => {
    return sequelize.define('nota', {
        id_nota: {
            type: type.INTEGER,
            primaryKey: true,
        },
        contenido: type.STRING,
        color: type.STRING,
        fondo: type.STRING,
        id_usuario: type.INTEGER
    });
}