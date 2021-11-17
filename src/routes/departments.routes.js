const express = require('express') //levantamos express 
const router = express.Router();//definimos router con el objeto express 
const DB = require('../db')//levantamos el archivo index de la base de datos. Aqui tenemos acceso a todas las consultas SQL que estan en db




// GET /api/v1/departamentos
router.get('/',async (req,res)=>{
    const deptos = await DB.Departmens.getAll();//esperamos desde la constante DB queremos obtener todos.  es un array de departamentos
    res.status(200).json(deptos) //deberia retornar el estado 200 y el json con los departamentos que estabamos esperando.  VER app.http
});


// GET /api/v1/departamentos/empleados
router.get('/employees',async (req,res)=>{
    const employees = await DB.Departmens.getAllEmployees();//esperamos desde la constante DB queremos obtener todos.  es un array de departamentos
    res.status(200).json(employees) //deberia retornar el estado 200 y el json con los departamentos que estabamos esperando.  VER app.http
});



// GET /api/v1/departamentos/:id
router.get('/:id',async (req,res)=>{//si no viene un valor ahi '' no se ejecuta esta ruta. usamos ese nombre de variable desde el objeto de solicitud. 
    const depto = await DB.Departmens.getById(req.params.id); //pueda que devuelva un depto como no. 
    if(depto){
        res.status(200).json(depto)
    }else{
        res.status(404).send('Departamento no encontrado!!!')
    }    
});

// GET /api/v1/departamentos/:id/manager
router.get('/:id/manager',async (req,res)=>{ //esto lo que hace es buscar el manager del departamento con id tanto 
    const depto = await DB.Departmens.getById(req.params.id);
    if(!depto){
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const manager = await DB.Departmens.getActualManager(depto);
    res.status(200).json(manager)//qe devuelva el 200 y el manager 
});

// POST /api/v1/departamentos //INSERT
router.post('/',async (req,res)=>{
    const {dept_no,dept_name} =req.body //en este objeto body tenemos las distintas propiedades del objeto. body puede tener cualquier atributo pero lo unico que me interesa es depto_no y dept_name a lo demas lo descarta. 
    if(!dept_no){
        res.status(400).send('dept_no es Requerido!!!')
        return
    }
    if(!dept_name){
        res.status(400).send('dept_name es Requerido!!!')
        return
    }
    const depto = await DB.Departmens.getById(dept_no);//que no exista un departamento con un id duplicado. 
    if(depto){
        res.status(500).send('ya existe el Departamento !!!')
        return
    }
    const deptoNuevo = {dept_no,dept_name} //defino un nuevo dpto con depto_no y dept_name 
    const isAddOk = await DB.Departmens.add(deptoNuevo) //en issaddok obtengo el resuiltado de INTENTAR agregar el departamento. 
    if(isAddOk){
        res.status(201).json(deptoNuevo) //si todo bien agrego xd 
    }else{
        res.status(500).send('Falló al agregar el departamento!!!') // si no esta definido mensaje de error 500 :/
    }
});

// PUT /api/v1/departamentos/:id //UPDATE put espera el parametro ID obligatorio 
router.put('/:id',async (req,res)=>{ 
    const {dept_name} =req.body    //nos interesa el dept_name 
    if(!dept_name){
        res.status(400).send('dept_name es Requerido!!!')
        return
    }
    const depto = await DB.Departmens.getById(req.params.id); //buscamos el depto
    if(!depto){
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    depto.dept_name=dept_name //realiza un set para cambiar el valor. 
    const isUpdateOk = await DB.Departmens.update(depto)//intenta guardarlo 
    if(isUpdateOk){ //si todo bien guarda xd 
        res.status(200).json(depto)
    }else{
        res.status(500).send('Falló al modificar el departamento!!!') //y si falla error 500 xd 
    }
});

// DELETE /api/v1/departamentos/:id //ELIMINAR
router.delete('/:id',async (req,res)=>{
    const depto = await DB.Departmens.getById(req.params.id);
    if(!depto){
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const isDeleteOk = await DB.Departmens.delete(depto)
    if(isDeleteOk){
        res.status(204).send()
    }else{
        res.status(500).send('Falló al eliminar el departamento!!!')
    }
});

// GET /api/v1/departamentos/:id/empleados
router.get('/:id/employees',async (req,res)=>{ 
    const depto = await DB.Departmens.getById(req.params.id);
    if(!depto){
        res.status(404).send('Departamento no encontrado!!!')
        return
    }
    const employees = await DB.Departmens.getAllE(depto);
    res.status(200).json(employees)
});



/*******PUNTO3*********/

router.put('/api/v1/departamentos/:id/empleado',async (req,res)=>{ 
    const {emp_no,dept_no} =req.body   

    
    if(!emp_no){
        res.status(400).send('emp_no es Requerido!!!')
        return
    }
    
    if(!dept_no){
        res.status(400).send('dept_name es Requerido!!!')
        return
    }


    const empleado = await DB.Departmens.getByEmp_no(req.params.id)

    if(!empleado){
        res.status(404).send('Empleado no encontrado!!!')
        return
    }


    const deptoEmp = await DB.Departmens.getByIdDept_emp(emp_no); //buscamos el depto

    if(!deptoEmp){
        res.status(404).send('Departamento_Empleado no encontrado!!!')
        return
    }

    deptoEmp.dept_no=dept_no //realiza un set para cambiar el valor. 
    deptoEmp.emp_no= emp_no

    const isUpdateOk = await DB.Departmens.updateEmployeeinDepto_emp(deptoEmp)//intenta guardarlo 

    if(isUpdateOk){ 
        res.status(200).json(deptoEmp)
    }else{
        res.status(500).send('Falló al modificar el departamento_Empleado!!!') //y si falla error 500 xd 
    }
});





/**********************/


module.exports=router //exportamos para poder usarlo. 