const pool = require("./connection.db");
const TABLE='dept_manager'

/********************************************
 * Punto 4
*El sistema debe permitir cambiar de Jefe de un Departamento:

Como podrá ver en la tabla dept_manager se gestiona la historia de todos los jefes
que tuvo un departamento. Recuerde que cuando el campo to_date sea igual a la
fecha especial '9999-01-01' de la tabla dept_manager que significa que ese registro
representa un empleado que actualmente se desempeña como jefe del departamento.
a. Desarrolle una api que le permita cambiar el jefe de departamento a un
departamento, recibiendo el dept_no del departamento y el emp_no del
empleado que desde ahora será el jefe de departamento.



select * from rrhh_dev.dept_manager where emp_no =110114
update rrhh_dev.dept_manager dm set dm.dept_no = "d007" where emp_no =110114 and to_date = '9999-01-01'
select * from rrhh_dev.dept_manager where emp_no =110114
*/

/**
 * Retorna un dept_emp 
 * @returns 
 */
 module.exports.getByIdDept_manager = async function (manager) { 
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`SELECT * FROM ${TABLE} d WHERE emp_no=?`,[manager.emp_no]);
      return rows[0];
    } catch (err) {
      return Promise.reject(err);
    } finally { 
      if (conn) await conn.release();
    }
  };
  
  
  /**
   * Modificar el departamento actual del manager
   * @param {Object} depto
   * @returns 
   */
   module.exports.updateManagerinDepto_manager = async function (depto) { //update 
    let conn;
    try {
      conn = await pool.getConnection();
    
      const SQL=`
      UPDATE rrhh_dev.${TABLE} de 
      SET de.dept_no = ?
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


