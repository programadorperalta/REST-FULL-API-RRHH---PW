const express = require('express') 
const router = express.Router();
const DB = require('../db')




// GET /api/v1/salarios/:id
router.get('/',async (req,res)=>{
    const salarios = await DB.Salaries.getAllSalaries(); 
    if(salarios){
        res.status(200).json(salarios)
    }else{
        res.status(404).send('Salarios no encontrados!!!')
    }    
});


// GET /api/v1/salarios/:id
router.get('/:id',async (req,res)=>{
    const salarios = await DB.Salaries.getSalaryById(req.params.id); 
    if(salarios){
        res.status(200).json(salarios)
    }else{
        res.status(404).send('Salarios no encontrado!!!')
    }    
});

/*************************************/



// POST /api/v1/salarios
router.post('/AddSalary',async (req,res)=>{
    const {emp_no,salary} =req.body   

    if(!emp_no){
        res.status(400).send('Emp_no es requerido!!')
        
        return
    }

    if(!salary){
        res.status(400).send('Salary es requerido!!')
        return
    }

    const empleado = await DB.Departmens.getByEmp_no(emp_no);

    if(!empleado){
        res.status(400).send('Empleado no encontrado')
        return
    }

    const salarioAux = await DB.Salaries.getActualSalaryFromDateActual(empleado)

    if(salarioAux){
        res.status(404).send('Salario duplicado!! ERROR')
        return
    }

    const salario = await DB.Salaries.getActualSalary(empleado); //buscamos el salario

    if(!salario){
        res.status(404).send('Salario no encontrado!!!')
        return
    }

    const nuevoSalario = {emp_no,salary}

    const isAddOk = await DB.Salaries.addSalary(nuevoSalario) 
    if(isAddOk){
        res.status(201).json(nuevoSalario) 
    }else{
        res.status(500).send('Falló al agregar el nuevo salario!!!')
    }
});





//PUT /api/v1/departamentos/empleados/:id/salario
router.put('/:id/employee/UpdateSalary',async (req,res)=>{ 
    const {emp_no,salary} =req.body  
    
    if(!emp_no){
        res.status(400).send('Emp_no es requerido!!')
        return
    }

    if(!salary){
        res.status(400).send('Salary es requerido!!')
        return
    }

    const empleado = await DB.Departmens.getByEmp_no(req.params.id);


    if(!empleado){
        res.status(400).send('Empleado no encontrado')
        return
    }

    const salario = await DB.Salaries.getActualSalary(empleado);

    if(!salario){
        res.status(404).send('Salario no encontrado!!!')
        return
    }

    const newSalary = {emp_no,salary}

    const isUpdateOk = await DB.Salaries.updateSalary(newSalary)

    if(isUpdateOk){
        res.status(200).json(salario)

    }else{
        res.status(500).send('Falló al modificar el salario!!!') 
    }

});


router.put('/:id/employee/UpdateSalary/date',async (req,res)=>{ 
    const {emp_no} =req.body  
    
    if(!emp_no){
        res.status(400).send('Emp_no es requerido!!')
        return
    }

    const empleado = await DB.Departmens.getByEmp_no(req.params.id);


    if(!empleado){
        res.status(400).send('Empleado no encontrado')
        return
    }


    const salario = await DB.Salaries.getActualSalary(empleado); 

    if(!salario){
        res.status(404).send('Salario no encontrado!!!')
        return
    }


    const newSalary = {emp_no}

    const isUpdateOk = await DB.Salaries.updateSalaryDate(newSalary)
    if(isUpdateOk){
        res.status(200).json(salario)

    }else{
        res.status(500).send('Falló al modificar el salario!!!') 
    }

});


module.exports=router
