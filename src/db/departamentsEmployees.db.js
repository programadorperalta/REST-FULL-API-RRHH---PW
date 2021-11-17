const pool = require("./connection.db");
const TABLE='dept_emp'

/********************************************
 * Punto 3
*El sistema debe permitir mover un empleado del Departamento actual donde trabaja a otro Departamento: 

De manera análoga al punto anterior, podrá ver que en la tabla dept_emp se gestiona
la historia de todos los departamentos donde cada empleado trabajó. Tenga en cuenta
que el campo to_date sea igual a la fecha especial '9999-01-01' de la tabla dept_emp
que significa que ese registro representa un empleado que actualmente trabaja en el
departamento.
a. Desarrolle una api que le permita mover un empleado desde el departamento actual, 
recibiendo el emp_no y dept_no del departamento destino.



select * from rrhh_dev.dept_emp where emp_no= 10001; 
update rrhh_dev.dept_emp de set de.dept_no ="d007" where emp_no =10001 and to_date = '9999-01-01'
select * from rrhh_dev.dept_emp where emp_no =10001 and to_date = '9999-01-01'

*/


/**
 * Retorna un dept_emp 
 * @param {Object} empleado
 * @returns 
 */
 module.exports.getByIdDept_emp = async function (empleado) { 
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d WHERE emp_no=?`,[empleado.emp_no]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};
  
  
  /**
   * Modificar el departamento actual del empleado
   * @param {Object} depto
   * @returns 
   */
   module.exports.updateEmployeeinDepto_emp = async function (depto) {  
    let conn;
    try {
      conn = await pool.getConnection();
    
      const SQL=`
      UPDATE rrhh_dev.${TABLE} de 
      SET de.dept_no = ? , de.to_date= current_date()
      WHERE emp_no = ?
      AND to_date = '9999-01-01'
      `;
  
      const params=[]
      params[0]=depto.dept_no
      params[1]=depto.emp_no
    
      
      const rows = await conn.query(SQL,params);
      return rows;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      if (conn) await conn.release();
    }
  };


  /**
   * Agrega un nuevo registro de departamento_empleado con la fecha de hoy
   * @param {Object} deptoEmpleado
   * @returns 
   */
   module.exports.addDeptoEmpleado = async function (deptoEmpleado) { 
    let conn;
    try {
      conn = await pool.getConnection();
  
      const SQL=
      `
      INSERT INTO ${TABLE} (emp_no,dept_no,from_date,to_date) 
      VALUES(?, ?, current_date() ,'9999-01-01')
      `;
  
      const params=[]
      params[0]=deptoEmpleado.emp_no
      params[1]=deptoEmpleado.dept_no
      
      const rows = await conn.query(SQL,params);
  
      return rows; 
  
    } catch (err) { 
      return Promise.reject(err);
    } finally { 
      if (conn) await conn.release();
    }
  };


  /**
   * Retorna deptoEmp con todate current_date 
   * @param {Object} empleado
   * @returns 
   */
 module.exports.getActualDeptoEmpToDateCurrentDate = async function (empleado) {
  let conn;
  try {
    conn = await pool.getConnection();

    const SQL=`
    SELECT * from rrhh_dev.${TABLE} s
    WHERE s.emp_no =? AND s.to_date = current_date()
    `;

    const rows = await conn.query(SQL,[empleado.emp_no]);

    return rows[0];

  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};
