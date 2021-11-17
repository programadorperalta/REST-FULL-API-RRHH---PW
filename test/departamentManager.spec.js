require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");


describe("Rest API DepartamentosEmpleados", () => {
  
    /*
    i. Comprobar que exista el departamento.
    ii. Comprobar que exista el empleado.
    iii. Comprobar que el empleado que desde ahora será jefe del
    departamento es distinto al jefe anterior.
    iv. Comprobar que los códigos de estado del protocolo http en las
    respuestas sean correctos.
    v. Comprobar que después de ejecutar la api existe un nuevo registro en
    la tabla dept_manager para ese departamento y ese empleado.
    vi. Comprobar que después de ejecutar la api el anteúltimo registro de ese
    departamento con el campo to_date cambió de la fecha ‘9999-01-01’ a
    la fecha de hoy.
    vii. Comprobar que después de ejecutar la api el último registro de ese
    departamento con el campo from_date con la fecha de hoy, el campo
    to_date con el valor ‘9999-01-01’ y el campo emp_no del nuevo jefe.    
*/


         it("GET /api/v1/departamentosEmpleados/10001/empleado", async () => { //pedimos uno con id especifico d009 
            const response = await request(app).get("/api/v1/departamentosEmpleados/10001/empleado");
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            const empleado = response.body;
            expect(empleado).toBeDefined();
            expect(empleado.emp_no).toBeDefined();
            expect(empleado.emp_no).toBe(10001);
          });
         
        

          it("GET /api/v1/departamentos/d009", async () => { 
            const response = await request(app).get("/api/v1/departamentos/d009");
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            const depto = response.body;
            expect(depto).toBeDefined();
            expect(depto.dept_no).toBeDefined();
            expect(depto.dept_no).toBe("d009");
          });

    
  });

