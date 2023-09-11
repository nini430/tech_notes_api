export interface UserValues {
    username:string;
    password:string;
    roles:string[];  
}

export interface UserUpdateValues {
    username:string;
    password:string;
    roles:string[];
    id:string;
    active:boolean;
}