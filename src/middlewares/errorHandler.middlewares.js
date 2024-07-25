import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const errorHandler = (err, req, res, next) => {
    if(err instanceof ApiError) {
        const response = new ApiResponse(err.statusCode, null, err.message);
        response.success = false;
        response.errors = err.errors;
        res.status(response.statusCode).json(response);
    }else{
        const response = new ApiResponse(500, null, "Internal Server Error");
        response.success = false;
        res.status(response.statusCode).json(response);
    }
};

export { errorHandler }