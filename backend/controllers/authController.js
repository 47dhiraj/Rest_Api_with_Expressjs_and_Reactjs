const User = require('../models/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



const handleLogin = async (req, res) => {

    const cookies = req.cookies;

    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: username }).exec();


    if (!foundUser) return res.sendStatus(401);                 


    const match = await bcrypt.compare(password, foundUser.password);   

    if (match) {

        const roles = Object.values(foundUser.roles);                 

        // Creating JWT, Fresh Access Token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,                            
            { expiresIn: '55s' }                                        
        );

        // Creating JWT, Fresh Refresh Token
        const freshRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,                          
            { expiresIn: '1d' }
        );


        let refinedRefreshTokenArray =
            !cookies?.jwt                                                   
                ? foundUser.refreshToken                                    
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);  
        

        if (cookies?.jwt) {

            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // if reuse of the previous refresh token detected at the login
            if (!foundToken)                                           
            {
                console.log('Attempted refresh token reuse at login !')
                refinedRefreshTokenArray = [];                          
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 0 });     
        }


        foundUser.refreshToken = [...refinedRefreshTokenArray, freshRefreshToken];
        const result = await foundUser.save();                          // saving the update to database

        res.cookie('jwt', freshRefreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 24 * 60 * 60 * 1000 });

        
        res.status(200).json({ roles, accessToken });

    } else {
        res.sendStatus(401);                                           
    }

}


module.exports = { handleLogin };                                       
