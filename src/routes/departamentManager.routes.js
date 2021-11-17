const express = require('express')
const router = express.Router();
const DB = require('../db')



/**********************PUNTO 4************************* */

router.put('/:id',async (req,res)=>{ 
    const {dept_no} =req.body   


    if(!dept_no){
        res.status(400).send('dept_name es Requerido!!!')
        return
    }

    const manager = await DB.Departmens.getByEmp_no(req.params.id)

    if(!manager){
        res.status(400).send('El Manager no existe!!')
        return
    }

    const deptoMan = await DB.DepartamentManager.getByIdDept_manager(manager); 


    if(!deptoMan){
        res.status(404).send('Departamento_Empleado no encontrado!!!')
        return
    }
    

    deptoMan.dept_no = dept_no
    deptoMan.emp_no = manager.emp_no

    const isUpdateOk = await DB.DepartamentManager.updateManagerinDepto_manager(deptoMan)

    if(isUpdateOk){ 
        res.status(200).json(deptoMan)
    }else{
        res.status(500).send('Falló al modificar el Departamento_Manager!!!') 
    }
});















module.exports=router