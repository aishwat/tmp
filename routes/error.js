var error = function(res, err,response) {
    if(response)
    {
    	console.log(response.body);
    	res.status(response.status).send(response.body);	
    }
    else
    {
    	console.log(err);
    	res.send(err); //or whatever error code , later 	
    }
    
};

module.exports=error;