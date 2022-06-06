const User = require('../models/User');

const jwt = require('jsonwebtoken');



const handleLogout = async (req, res) => {

    const cookies = req.cookies;                                

    if (!cookies?.jwt) return res.sendStatus(204);                 

    const refreshToken = cookies.jwt;
    
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 0 });

        return res.sendStatus(204);
    }

    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();      

    res.clearCookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 0 });

    res.sendStatus(204);
}


module.exports = { handleLogout }
