const mongoose = require("mongoose") ;

const connectionrequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true 
    } ,
    toUserId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true
    } ,
    status : {
        type : String ,
        required : true ,
        enum : {
            values : ["ignored" , "interested" , "accepted" , "rejected"] ,
            message : `{VALUE} is incorrect status type`
        }
    }
} ,
{ timestamps : true }
) ;

connectionrequestSchema.index({fromUserId : 1 , toUserId : 1}) ;

connectionrequestSchema.pre("save" , function () {
    const connectinRequest = this ;
    if(connectinRequest.fromUserId.equals(connectinRequest.toUserId)){
        throw new Error ("you can not send request to yourself") ;
    }
})

module.exports = mongoose.model("ConnectionRequest" , connectionrequestSchema) ;