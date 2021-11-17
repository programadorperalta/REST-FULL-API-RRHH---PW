const express = require('express') 
const router = express.Router(); 
const DB = require('../db')



// GET /api/v1/departamentoEmpleados/:id/empleado
router.get('/:id/empleado',async (req,res)=>{ 
    const empleado = await DB.Departmens.getByEmp_no(req.params.id);
    if(!empleado){
        res.status(404).send('Empleado no encontrado!!!')
        return
    }
    res.status(200).json(empleado)
});


router.get('/:id/DepartamentoEmpleado',async (req,res)=>{ 

    const empleado = await DB.Departmens.getByEmp_no(req.params.id);

    if(!empleado){
        res.status(404).send('Empleado no encontrado!!!')
        return
    }

    const deptoEmpleado = await DB.DepartamentEmployees.getByIdDept_emp(empleado);
    if(!deptoEmpleado){
        res.status(404).send('DepartamentoEmpleado no encontrado!!!')
        return
    }

    res.status(200).json(deptoEmpleado)
});


router.get('/:id/DeptoEmpActual',async (req,res)=>{ 

    const empleado = await DB.Departmens.getByEmp_no(req.params.id)

    if(!empleado){
        res.status(400).send('El empleado no existe!!')
        return
    }

    const deptoEmpActual = await DB.DepartamentEmployees.getActualDeptoEmpToDateCurrentDate(empleado)

    if(!deptoEmpActual){
        res.status(404).send('DepartamentoEmpleado actual no encontrado!!!')
        return
    }

    res.status(200).json(deptoEmpActual)
});









/*******PUNTO3*********/

router.put('/:id',async (req,res)=>{ 
    const {dept_no} =req.body   


    if(!dept_no){
        res.status(400).send('dept_name es Requerido!!!')
        return
    }

    const empleado = await DB.Departmens.getByEmp_no(req.params.id)

    if(!empleado){
        res.status(400).send('El empleado no existe!!')
        return
    }

    const deptoEmp = await DB.DepartamentEmployees.getByIdDept_emp(empleado); 


    if(!deptoEmp){
        res.status(404).send('Departamento_Empleado no encontrado!!!')
        return
    }
    

    deptoEmp.dept_no = dept_no
    deptoEmp.emp_no = empleado.emp_no

    const isUpdateOk = await DB.DepartamentEmployees.updateEmployeeinDepto_emp(deptoEmp)

    if(isUpdateOk){ 
        res.status(200).json(deptoEmp)
    }else{
        res.status(500).send('Falló al modificar el Departamento_Empleado!!!') 
    }
});


router.post('/AddDeptoEmpleados',async (req,res)=>{
    const {emp_no,dept_no} =req.body   

    if(!dept_no){
        res.status(400).send('Departamento es requerido!!')
        return
    }
   
    const empleado = await DB.Departmens.getByEmp_no(emp_no)
    
    if(!empleado){
        res.status(400).send('El empleado no existe!!')
        return
    }

    const deptoEmp = await DB.DepartamentEmployees.getByIdDept_emp(empleado); 

    if(!deptoEmp){
        res.status(400).send('DeptoEmpleado no encontrado')
        return
    }


    const nuevoDeptoEmp = {emp_no,dept_no}

    const isAddOk = await DB.DepartamentEmployees.addDeptoEmpleado(nuevoDeptoEmp) 
    if(isAddOk){
        res.status(201).json(nuevoDeptoEmp) 
    }else{
        res.status(500).send('Falló al agregar el nuevo DeptoEmpleado!!!') 
    }
});


module.exports=router


/**********************/