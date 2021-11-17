const pool = require("./connection.db");
const TABLE='departments' 
const TABLEMP='employees' 
const TABLESAL='salaries'



/**
 * Retorna todos los departamentos
 * @returns 
 */
module.exports.getAll = async function () { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d `);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un departamento por su clave primaria
 * @returns 
 */
module.exports.getById = async function (id) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d WHERE dept_no=?`,[id]); 
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally { 
    if (conn) await conn.release();
  }
};

/**
 * Retorna el manager actual de un Departamento y la fecha desde
 * @param {Object} departamento 
 * @returns 
 */
 module.exports.getActualManager = async function (departamento) {
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL=`
SELECT 
  e.*,
  dm.from_date AS fecha_desde
FROM dept_manager dm
	INNER JOIN employees e ON (e.emp_no = dm.emp_no)
WHERE dm.dept_no = ? AND dm.to_date='9999-01-01'
`;
    const rows = await conn.query(SQL,[departamento.dept_no]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Agrega un departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.add = async function (departamento) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL=`INSERT INTO ${TABLE} (dept_no, dept_name) VALUES(?, ?)`
    const params=[]
    params[0]=departamento.dept_no
    params[1]=departamento.dept_name
    const rows = await conn.query(SQL,params);
    return rows; 
  } catch (err) {  
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * eliminar un Departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.delete = async function (departamento) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`DELETE FROM ${TABLE} WHERE dept_no=?`,[departamento.dept_no]);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Modifica un Departamento
 * @param {Object} departamento 
 * @returns 
 */
module.exports.update = async function (departamento) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const SQL=`UPDATE ${TABLE}  SET dept_name=? WHERE dept_no=?`
    const params=[]
    params[0]=departamento.dept_name
    params[1]=departamento.dept_no    
    const rows = await conn.query(SQL,params);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retornar empleados que pertenecen a un departamento 
 * @param {Object} dep
 * @returns 
 */
 module.exports.getAllE = async function (dep) { 
  let conn;
  try {
    conn = await pool.getConnection();

    const SQL=`
    SELECT e.* FROM ${TABLEMP} e 
    INNER JOIN dept_emp de 
    ON e.emp_no = de.emp_no where de.dept_no =? 
    and de.to_date ='9999-01-01'`;

    const rows = await conn.query(SQL,[dep.dept_no]);
    return rows;
  } catch (err) {
    return Promise.reject(err); 
  } finally {
    if (conn) await conn.release(); 
  }
};


/**
 * Retornar todos los empleados
 * 
 * @returns 
 */
 module.exports.getAllEmployees = async function () { 
  let conn;
  try {
    conn = await pool.getConnection();

    const SQL=`
    SELECT * FROM ${TABLEMP}`;

    const rows = await conn.query(`SELECT * FROM ${TABLEMP}`);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/********************************************
 * Punto 2
*El sistema debe permitir cambiar el salario a un Empleado:
*Un aumento de sueldo al empleado con emp_no=10010 debe modificar el campo
*to_date del último registro asignando la fecha de hoy (CURRENT_DATE), y luego
*generar un nuevo registro para el mismo empleado con el campo from_date igual a la
*fecha de hoy y el campo to_date con la fecha ‘9999-01-01’  
*/

/**
 * Retorna un empleado por su clave primaria
 * @returns 
 */
 module.exports.getByEmp_no = async function (id) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLEMP} WHERE emp_no=?`,[id]); 
    return rows[0]; 
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
 module.exports.updateSalary = async function (salario) { //update 
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
    INSERT INTO rrhh_dev.${TABLESAL} (emp_no,salary,from_date,to_date) 
    VALUES (?,?, current_date() ,'9999-01-01')
    `;

    const params=[]
    params[0]=salario.emp_no
    params[1]=salario.salary
    
    const rows = await conn.query(SQL,params);

    return rows; 

  } catch (err) { 
    return Promise.reject(err);
  } finally {  
    if (conn) await conn.release();
  }
};

/***************************************************************************************** */