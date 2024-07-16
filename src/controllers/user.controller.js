import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const registerUser = asyncHandler( async(req, res) => {
    // get user detail from frontend
    // validation of data receieved - emptyness
    // check if user already exist (username email)
    // check for images, check for avatar
    // upload to cloudinary and get the url, avatar
    // create user object to send data on mongodb - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res if success or return error if something happend

    const {username, fullname, email, password} = req.body;
    console.log(`email: ${email}`);
    // we can check like this for every field
    // if(fullname === ""){
    //     throw new ApiError(400, "Fullname is required");
    // }

    if([fullname, email, username, password].some( (field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser =  User.findOne({$or: [{username}, {email}]});
    if(existedUser)
    {
        throw new ApiError(409, "User with email or username is already exist ");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath)
    {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if(!avatar)
    {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while creation of user");
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfullly")
    )

})


export {registerUser}