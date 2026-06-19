const express=require('express');
const app=express();
app.use(express.json());
app.use('/api',require('./src/api/routes'));
app.listen(process.env.PORT||3000,()=>console.log('started'));
