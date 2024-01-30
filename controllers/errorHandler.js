const errorHandler = (err, req, res, next) => {
    res.status(res.status||500).send(err.message||"a fault has occurred");
    }; 
export default errorHandler;