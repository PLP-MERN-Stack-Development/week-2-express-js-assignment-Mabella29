// global error handler
function errorHandler(error, req,res, next){
    const statusCode = error.statusCode || 500
    const status = error.status || 'error'
    const message = error.message || 'server error'

    res.status(statusCode).json({
        status: status,
        message: message
    })
    next()
}

// custom error
class CustomError extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode = statusCode;
        this.status = statusCode >=400 && statusCode <500? 'fail':'error'
        Error.captureStackTrace(this,this.constructor)
    }
}

class NotFoundError extends customError{
    constructor(message='Resource not found'){
        super(message,404)
    }
}
class ValidationError extends CustomError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

module.exports = {
    CustomError, ValidationError,NotFoundError,errorHandler
}