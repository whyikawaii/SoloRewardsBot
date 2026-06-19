const r=require('express').Router();
r.post('/daily',(req,res)=>res.json({ok:true}));
r.post('/task/complete',(req,res)=>res.json({ok:true}));
r.post('/user',(req,res)=>res.json({ok:true}));
r.post('/referral',(req,res)=>res.json({ok:true}));
r.get('/leaderboard',(req,res)=>res.json([]));
module.exports=r;