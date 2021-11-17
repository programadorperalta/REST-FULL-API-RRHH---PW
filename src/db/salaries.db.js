const pool = require("./connection.db");
const TABLESAL='salaries'

/**
 * Retorna todos los salarios
 * @returns 
 */
 module.exports.getAllSalaries = async function () {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLESAL} s `);
    return rows;
  } catch (err) {
    return Promise.reject(err); 
  } finally {
    if (conn) await conn.release();
  }
};


/**
 * Retorna un salario por su clave primaria
 * @returns 
 */
module.exports.getSalaryById = async function (id) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLESAL} s WHERE emp_no=? and from_date = current_date() `,[id]);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally { 
    if (conn) await conn.release();
  }
};


/**
 * Modifica un Salario de un empleado 
 * @param {Object} salario
 * @param {Object} empleado
 * @returns 
 */
 module.exports.updateSalary = async function (salario) { 
    let conn;
    try {
      conn = await pool.getConnection();
    
      const SQL=`
      UPDATE rrhh_dev.${TABLESAL} s
      SET s.to_date = current_date() , s.salary=?
      WHERE emp_no =?
      AND to_date = '9999-01-01'
      `;

      const params=[]
      params[0]=salario.salary
      params[1]=salario.emp_no


      const rows = await conn.query(SQL,params);
      return rows;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      if (conn) await conn.release();
    }
  };

/**
 * Modifica un Salario de un empleado 
 * @param {Object} salario
 * @param {Object} empleado
 * @returns 
 */
 module.exports.updateSalaryDate = async function (salario) { 
  let conn;
  try {
    conn = await pool.getConnection();
  
    const SQL=`
    UPDATE rrhh_dev.${TABLESAL} s
    SET s.to_date = current_date()
    WHERE emp_no =?
    AND to_date = '9999-01-01'
    `;


    const rows = await conn.query(SQL,salario.emp_no);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

  
  /**
   * Retorna el salario del empleado actual
   * @param {Object} empleado
   * @returns 
   */
   module.exports.getActualSalary = async function (empleado) {
    let conn;
    try {
      conn = await pool.getConnection();
  
      const SQL=`
      SELECT * from rrhh_dev.${TABLESAL} 
      WHERE emp_no =?
      ORDER BY to_date DESC`;
  
      const rows = await conn.query(SQL,[empleado.emp_no]);
  
      return rows[0];
  
    } catch (err) {
      return Promise.reject(err);
    } finally {
      if (conn) await conn.release();
    }
  };
  
  /**
   * Agrega un nuevo registro de salario para el empleado actual con la fecha de hoy
   * @param {Object} salario 
   * @returns 
   */
   module.exports.addSalary = async function (salario) { 
    let conn;
    try {
      conn = await pool.getConnection();
  
      const SQL=
      `
      INSERT INTO ${TABLESAL} (emp_no,salary,from_date,to_date) 
      VALUES(?, ?, current_date() ,'9999-01-01')
      `;
  
      const params=[]
      params[0]=salario.emp_no
      params[1]=salario.salary
      
      const rows = await conn.query(SQL,params);
  
      return rows; //devuelve lo que encontro 
  
    } catch (err) { //si no error. 
      return Promise.reject(err);
    } finally { //libera 
      if (conn) await conn.release();
    }
  };

/**
   * Retorna el salario con fecha actual de un empleado
   * @param {Object} empleado
   * @returns 
   */
 module.exports.getActualSalaryFromDateActual = async function (empleado) {
  let conn;
  try {
    conn = await pool.getConnection();

    const SQL=`
    SELECT * from rrhh_dev.${TABLESAL} s
    WHERE s.emp_no =?
    AND s.from_date = current_date()
    ORDER BY to_date DESC
    `;

    const rows = await conn.query(SQL,[empleado.emp_no]);

    return rows[0];

  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};
