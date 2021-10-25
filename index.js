const express = require("express");
require('dotenv').config();

const app = express();

let PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server started on ${PORT}`);
});