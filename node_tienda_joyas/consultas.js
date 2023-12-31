const { Pool } = require("pg");
const format = require("pg-format");
const dotenv = require("dotenv");

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
});

const getJoyas = async ({ limits = 2, page = 1, order_by = "id_ASC" }) => {
  try {
    const offset = (page - 1) * limits;
    const [campo, direccion] = order_by.split("_");
    const query = format(
      "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limits,
      offset
    );
    console.log("Consulta: ", query);
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("murio: ", error);
  }
};

const getJoyasFiltros = async ({
  precio_max,
  precio_min,
  categoria,
  metal,
}) => {
  try {
    const filtros = [];
    if(metal) {
      filtros.push(`metal = '${metal}'`);
    }
    if(categoria) {
      filtros.push(`categoria = '${categoria}'`)
    }
    if(precio_max) {
      filtros.push(`precio <= ${precio_max}`)
    }
    if(precio_min) {
      filtros.push(`precio >= ${precio_min}`)
    }
    let query = "SELECT * FROM inventario"
    if(filtros.length > 0) {
      query = query + ' WHERE ' + filtros.join(' AND ')
      console.log(query)
    }
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("murio: ", error);
  }
};

module.exports = { getJoyas, getJoyasFiltros };
