require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");



describe("Rest API Salarios", () => {
    
   

  it("GET /api/v1/salarios/10001", async () => {
    const response = await request(app).get("/api/v1/salarios/10001");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const salarios = response.body;
    expect(salarios).toBeDefined();

    salarios.forEach(salario => {
        expect(salario.emp_no).toBe(10001);
        expect(salario.salary).toBeDefined();
    });

    expect(salarios.length).toBeGreaterThan(0);
  });



    it("Verificar que modifica con PUT /api/v1/salarios", async () => {
    const salario = { emp_no:10058,salary:53906};


    //Primero agregamos
    const response = await request(app)
      .post("/api/v1/salarios/AddSalary")
      .send(salario);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(salario);
   
     //Ahora modificamos con PUT
     const salarioCopia = { ...salario}; 
     salarioCopia.salary = 13500;
     const responseUpdate = await request(app)
       .put("/api/v1/salarios/10058/employee/UpdateSalary")
       .send(salarioCopia); 
     expect(responseUpdate).toBeDefined();
     expect(responseUpdate.statusCode).toBe(200);


     const salarioCopiaVerificar = { ...salarioCopia}; 
           

     expect(responseUpdate.body.emp_no).toStrictEqual(salarioCopiaVerificar.emp_no); 
     expect(responseUpdate.body.salary).toStrictEqual(salarioCopiaVerificar.salary);
     


        
});
      
   


    
  });
