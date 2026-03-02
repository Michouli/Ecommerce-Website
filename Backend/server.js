require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const cookieParser=require("cookie-parser");
const cors=require("cors");

const authRoutes=require("./routes/auth");
const app=express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:true,
    credentials:true
}));

app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>res.send("Backend running"));

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB connected");
    app.listen(process.env.PORT|| 5000,()=>{
        console.log("Server running on port",process.env.PORT||5000);
    });
}).catch((err)=>console.error(err));