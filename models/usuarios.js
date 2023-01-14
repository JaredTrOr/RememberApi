module.exports = (sequelize, type) => {
    return sequelize.define('usuario', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING(60),
        usuario: type.STRING(60),
        email: type.STRING(60),
        password: type.STRING,
        foto: type.STRING,
        rol: type.INTEGER,
        estado: type.INTEGER
    });
}