const express = require('express');
const app = express();

const db = require('./models'); //grabs the tables from models 
 //Models is where we can crate our tables without needing to use MySQL

//Routers
const postRouter= require('./routes/Posts');
app.use('post', postRouter); 

 db.sequelize.sync().then(() => {
    app.listen(5001, () => { 
    console.log('Server running on port 5001');
 });
});

