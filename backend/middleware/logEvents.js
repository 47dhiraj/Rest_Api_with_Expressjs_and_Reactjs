const { format } = require('date-fns')
const { v4: uuid } = require('uuid')


const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')



const logEvents = async (message, logFileName) => {                                    

    const dateTime = `${format(new Date(), 'yy-MM-dd\tHH:mm:ss')}`

    const logTime = `uuid: ${uuid()}\t DateTime: ${dateTime}\t ${message} \n`


    try {

        if (!fs.existsSync(path.join(__dirname, '../', 'logs'))) {                                  // yedi logs vanni directory(folder) chaina vani
            await fsPromises.mkdir(path.join(__dirname, '../', 'logs'));                            // logs vanni directory lai create gareko
        }

        await fsPromises.appendFile(path.join(__dirname, '../', 'logs', logFileName), logTime)      // appendFile() function does not create the logs folder or directory if it doesnot exists,, so mathi nai logs folder create gareko

    } catch (err) {
        console.log(err)
    }

}



const logger = (req, res, next) => {

    logEvents(`method: ${req.method}\t req_origin: ${req.headers.origin}\t req_url: ${req.url}`, 'reqLog.txt');         

    next();                                             
}



module.exports = { logger, logEvents };    

