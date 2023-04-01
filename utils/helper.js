const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { StatusCodes } = require('http-status-codes')
const logger = require('./logger')


const createToken = user => {
    return jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: '1 week' });
}

const verifyToken = (token) => {
    const isVerify = { decodedToken: null }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
        isVerify.decodedToken = decodedToken

    } catch (error) {
        isVerify.decodedToken = null
        console.log('error', error)
    }
    return isVerify
}

const logToError = (error, req, message) => {
    logger.error(`
    IP Adresi : ${req.ip} - 
    PATH :${req.path} - 
    BODY : ${JSON.stringify(req.body)} -
    PARAMS : ${JSON.stringify(req.params)}  - 
    QUERY : ${JSON.stringify(req.query)} - 
    ERROR  TIME : ${Date.now()} - 
    URL :${req.url} - 
    ERROR MESSAGE : ${error.message}
    ERROR CALLSTACK : ${JSON.stringify(error)} - 
    CUSTOM-INFO : ${message}
    `)
}

const handleValidation = (req) => {
    const validationErrors = validationResult(req)
    if (validationErrors.isEmpty() === false) {
        return {
            message: "Geçersiz Veri",
            success: false,
            validationErrors: validationErrors.array(),
            error: true,
            timestamp: Date.now(),
            code: StatusCodes.BAD_REQUEST
        }
    }
    return null
}

module.exports = {
    createToken,
    verifyToken,
    handleValidation,
    logToError
}