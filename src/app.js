const express = require('express')
const app=express() 
const ROUTES=require('./routes')
const cors = require('cors')


app.use(express.json()) 
app.use(express.urlencoded({extended: true})) 
app.use(cors())


app.get('/',(req,res)=>{ 
    res.send('Hola Mundo!!!')
});

app.get('/ping',(req,res)=>{
    res.json({msg:'pong'})
});

app.use('/api/v1/departamentos/',ROUTES.Departments)
app.use('/api/v1/salarios/',ROUTES.Salaries)
app.use('/api/v1/departamentosEmpleados/',ROUTES.DepartamentEmployees)
app.use('/api/v1/departamentoManager/',ROUTES.DepartamentManager)


module.exports=app