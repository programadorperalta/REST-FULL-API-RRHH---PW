require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");


describe("Rest API DepartamentosEmpleados", () => {
    
    /*Retornar todos los salarios de un empleado*/
    /** 
     * i. Comprobar que exista el empleado.
     *ii. Comprobar que exista el departamento destino.
      iii. Comprobar que el departamento destino sea distinto al departamento
            actual del empleado.
      iv. Comprobar que los códigos de estado del protocolo http en las
            respuestas sean correctos.
      v. Comprobar que después de ejecutar la api existe un nuevo registro para
        ese empleado.
      vi. Comprobar que después de ejecutar la api el anteúltimo registro de ese
        empleado con el campo to_date cambió de la fecha ‘9999-01-01’ a la
        fecha de hoy.
    vii. Comprobar que después de ejecutar la api el último registro de ese
         empleado con el campo from_date con la fecha de hoy, el campo
         to_date con el valor ‘9999-01-01’ y el campo dept_no del nuevo
         departamento.
     * 
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

         
          
          it("GET /api/v1/departamentosEmpleados/10001/DepartamentoEmpleado", async () => { 
            const response = await request(app).get("/api/v1/departamentosEmpleados/10001/DepartamentoEmpleado");
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            const deptoEmpleado = response.body;
            expect(deptoEmpleado).toBeDefined();
            expect(deptoEmpleado.dept_no).toBeDefined();
            const departamentoDestino = "d003"
            if(deptoEmpleado.dept_no!=departamentoDestino){
                expect(deptoEmpleado.dept_no).toBe("d007");
            }

          });

         

          it("Verificar que modifica con PUT /api/v1/departamentosEmpleados/10001", async () => {
            const depto = { dept_no: "d003"};

        
            const responseUpdate = await request(app)
              .put("/api/v1/departamentosEmpleados/10001") 
              .send(depto); 
            expect(responseUpdate).toBeDefined();
            expect(responseUpdate.statusCode).toBe(200);
            

            const response = await request(app).get("/api/v1/departamentosEmpleados/10001/DepartamentoEmpleado");
            expect(response).toBeDefined();
            expect(response.statusCode).toBe(200);
            const deptoEmpleado = response.body;
            expect(deptoEmpleado).toBeDefined();
            expect(deptoEmpleado.dept_no).toBe(depto.dept_no);
        
          });

          it("Verificar que modifica con PUT y Insert /api/v1/departamentosEmpleados/10030", async () => {
            const deptoEmp = { emp_no:10035,dept_no:"d003"};
            const deptoEmpAux = {dept_no:"d003"}
            const to_date = '9999-01-01'
            //update
            const responseUpdate = await request(app)
              .put("/api/v1/departamentosEmpleados/10035") 
              .send(deptoEmpAux); 
            expect(responseUpdate).toBeDefined();
            expect(responseUpdate.statusCode).toBe(200);
            

            //get 
            const responseGET = await request(app).get("/api/v1/departamentosEmpleados/10035/DeptoEmpActual");
            expect(responseGET).toBeDefined();
            expect(responseGET.statusCode).toBe(200);
            const deptoEmpleado = responseGET.body;
            expect(deptoEmpleado).toBeDefined();
            expect(deptoEmpleado.dept_no).toBeDefined();
            expect(deptoEmpleado.dept_no).toBe("d003");

            if(deptoEmpleado.to_date!=to_date){
               res.send("To_day Actual!!")
            }

             //insert
             const responseINSERT = await request(app)
             .post("/api/v1/departamentosEmpleados/AddDeptoEmpleados")
             .send(deptoEmp);
             expect(responseINSERT).toBeDefined();
             expect(responseINSERT.statusCode).toBe(201);
            
        
          });
       
          



    
  });

