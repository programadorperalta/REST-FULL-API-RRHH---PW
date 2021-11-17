require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");

describe("Rest API Departamentos", () => {
  it("GET /api/v1/departamentos", async () => {
    const response = await request(app).get("/api/v1/departamentos");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const deptos = response.body;//desde el cuerpo obtengo deptos
    expect(deptos.length).toBeGreaterThan(0);//comprobamos que ese tamaño del arreglo debe ser mayor que 0, si no devuelve ningun valor este test no pasaria. 
  });


/*Retornar todos los empleados*/
  it("GET /api/v1/departamentos/d002/employees", async () => {
    const response = await request(app).get("/api/v1/departamentos/d002/employees");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const empleados = response.body;//desde el cuerpo obtengo empleados
    expect(empleados).toBeDefined();
    expect(empleados.length).toBeGreaterThan(0);//comprobamos que ese tamaño del arreglo debe ser mayor que 0, si no devuelve ningun valor este test no pasaria. 
  });

/******************************/


  it("GET /api/v1/departamentos/d009", async () => { //pedimos uno con id especifico d009 
    const response = await request(app).get("/api/v1/departamentos/d009");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const depto = response.body;//recibo el cuerpo lo guardo en depto
    expect(depto).toBeDefined();
    expect(depto.dept_no).toBeDefined();
    expect(depto.dept_no).toBe("d009");//el atributo de ese depto tiene que ser d009 
    expect(depto.dept_name).toBeDefined(); //el noimbre del depto tiene que estar definido 
    expect(depto.dept_name).toBe("Customer Service"); //este depto con ese nombre tiene que etar en la tabla que existe en la base de datos. 
  });



  it("GET /api/v1/departamentos/d009/manager", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009/manager");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const manager = response.body; 
    expect(manager).toBeDefined(); 
    expect(manager.emp_no).toBeDefined();
    expect(manager.emp_no).toBe(111939); 
    expect(manager.first_name).toBeDefined();
    expect(manager.first_name).toBe("Yuchang");
  });

  it("GET /api/v1/departamentos/d00999", async () => { 
    const response = await request(app).get("/api/v1/departamentos/d00999");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404); 
    expect(response.text).toBe("Departamento no encontrado!!!"); 
  });

  it("POST /api/v1/departamentos  sin parámetros", async () => { 
    const response = await request(app).post("/api/v1/departamentos").send(); 
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_no", async () => { 
    const depto = { dept_no: "d999" };
    const response = await request(app) 
      .post("/api/v1/departamentos")
      .send(depto); 
    expect(response).toBeDefined(); 
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_name es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_name", async () => { 
    const depto = { dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);//envio el depto 
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("Verificar que agrega con POST /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201); 
    expect(response.body).toStrictEqual(depto);


    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(depto);


    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });

  it("Verificar que modifica con PUT /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    //Primero Agregamos
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(depto);

    //Ahora modificamos con PUT
    const deptoCopia = { ...depto };
    deptoCopia.dept_no = "este código no lo tiene en cuenta";
    deptoCopia.atributoAdicional =
      "a este atributo adicional tampoco lo tiene en cuenta";
    deptoCopia.dept_name = "Departamento 999";
    const responseUpdate = await request(app)
      .put("/api/v1/departamentos/d999") 
      .send(deptoCopia);
    expect(responseUpdate).toBeDefined();
    expect(responseUpdate.statusCode).toBe(200);
    const deptoCopiaVerificar = { ...depto }; 
    deptoCopiaVerificar.dept_name = "Departamento 999";
    expect(responseUpdate.body).toStrictEqual(deptoCopiaVerificar); 

    
    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(deptoCopiaVerificar); 

    // luego eliminar
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });

});






