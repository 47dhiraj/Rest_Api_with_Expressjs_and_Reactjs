const User = require('../models/User');

const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {

    const cookies = req?.cookies;                           

    if (!cookies?.jwt) return res.sendStatus(401);         

    const refreshToken = cookies.jwt;                      

    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: false, maxAge: 0 });

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();    

    if (!foundUser) {

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);                        

                const hackedUser = await User.findOne({ username: decoded.username }).exec(); 
                hackedUser.refreshToken = [];                               
                const result = await hackedUser.save();                     
            }
        )

        return res.sendStatus(403);                           
    }

    const refinedRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);    

    // Verifying JWT Token
    jwt.verify(                                                            
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {

            if (err) {
                foundUser.refreshToken = [...refinedRefreshTokenArray];   
                const result = await foundUser.save();                     
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403); 

            const roles = Object.values(foundUser.roles);  


            // Creating New Access Token
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,            
                { expiresIn: '55s' }                       
            );


            // Creating New Refresh Token
            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // updating new refresh token to database
            foundUser.refreshToken = [...refinedRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();         

            // sending new refresh token as cookie response
            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 24 * 60 * 60 * 1000 });


            res.status(200).json({ roles, accessToken })    
        }
    );

}

module.exports = { handleRefreshToken }
