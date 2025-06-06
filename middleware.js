
require('dotenv').config();
//logger
const logger = (req,res,next)=>{
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next()
}


//auth that checks for api key
const authenticate =(req,res,next)=>{
    const userKey = req.headers['x-api-key']
    const serverKey = process.env.API_KEY

    console.log('userKey',userKey)
    console.log('server key', serverKey)

    if (!userKey){
        return res.status(400).json({message: 'unauthorized user'})
    }
    if(userKey !== serverKey) 
        return res.status(401).json({message: 'Api key not found'})
    next()
} 

//validation
const validationProductCreation = (req,res,next)=>{
    const {name, description, price, category,inStock} = req.body;

    if(!name || !category || !description){
        return res.status(400).json({message: 'name, category and description are required'})
    }
    if(price !== undefined && typeof price !=="number"){
        return res.status(400).json({message: 'price must be a number'})
    }

    if(inStock !== undefined && typeof inStock !== "boolean"){
        return res.status(400).json({message:'inStock must be true or false '})
    }
    next()
}

module.exports = {logger,authenticate,validationProductCreation}