require('dotenv').config()                                              

const express = require('express');                                     
const app = express();             

const mongoose = require('mongoose');                             

const path = require('path');                                          

const cors = require('cors');

const corsOptions = require('./config/corsOptions');                    

const { logger } = require('./middleware/logEvents');                  
const errorHandler = require('./middleware/errorHandler');             

const verifyJWT = require('./middleware/verifyJWT');                   

const credentials = require('./middleware/credentials');

const cookieParser = require('cookie-parser');                         

const connectDB = require('./config/dbConn');                           

const PORT = process.env.PORT || 3500;                                

// Connecting with Database
connectDB();


// Using Middlewares

app.use(logger);                                                        

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());



// Using cookie-parser middleware
app.use(cookieParser());              


// serving static files to browser
app.use('', express.static(path.join(__dirname, '/public')));         


// Main Routes
app.use('/auth', require('./routes/api/auth'));
app.use('/register', require('./routes/api/register'));                
app.use('/refresh', require('./routes/api/refresh'));                 
app.use('/logout', require('./routes/api/logout'));                  
app.use('', require('./routes/root'));                               

// verifyJWT is a custom middleware
app.use(verifyJWT);                                                    
app.use('/employees', require('./routes/api/employees'));              
app.use('/users', require('./routes/api/users'));                      


app.all('*', (req, res) => {                                       

    res.status(404);

    if (req.accepts('html')) {                                      
        res.sendFile(path.join(__dirname, 'views', '404.html'));    

    } else if (req.accepts('json')) {                               
        res.json({ "error": "404 Not Found" });                    

    } else {
        res.type('txt').send("404 Not Found");                     
    }

});



// Using Custom errorHandler middleware
app.use(errorHandler);


// when connected with database, open connectio.once() function is called
mongoose.connection.once('open', () => {                  

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

});

