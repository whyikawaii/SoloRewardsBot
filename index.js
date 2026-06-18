
require("dotenv").config();
const express=require("express");
const path=require("path");
const {Telegraf}=require("telegraf");

const app=express();
const bot=new Telegraf(process.env.BOT_TOKEN);

const WEBAPP_URL=`${process.env.BASE_URL}/webapp`;

app.use("/webapp",express.static(path.join(__dirname,"webapp")));

bot.start((ctx)=>{
 return ctx.reply("🚀 Solo Rewards",{
  reply_markup:{
   inline_keyboard:[[{
    text:"🎁 Open Solo Rewards",
    web_app:{url:WEBAPP_URL}
   }]]
  }
 });
});

app.get("/",(req,res)=>res.send("SoloRewards OK"));
app.listen(process.env.PORT||8080,()=>{
 console.log("Server started");
 bot.launch();
});
