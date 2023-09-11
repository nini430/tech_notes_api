import allowedOrigins from "./allowedOrigins";

const corsOptions={
    origin:(origin:string,callback:any)=>{
        if(!origin || allowedOrigins.indexOf(origin)!==-1) {
            callback(null,true);
        }else{
            callback(new Error('not allowed by CORS'));
        }
    },
    credentials:true,
    optionsSuccessStatus:200
}

export default corsOptions;