const ICrud = require("../interfaces/interfaceCrud");
const Sequelize = require("sequelize");

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async create(item) {
    return this._schema.create(item);
  }

  async read(item) {
    return this._schema.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return this._schema.update(item, { where: { id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);

    await model.sync();
    return model;
  }

  static async connect() {
    const connection = new Sequelize(
      "heroes",
      "franciscogsilverio",
      "secretpassword",
      {
        host: "localhost",
        dialect: "postgres",
        quoteIdentifiers: false,
        operatorAliases: false,
        logging: false,
      }
    );

    return connection;
  }
}

module.exports = Postgres;
