import api from "./axios";



export const getProfile = ()=>{


    return api.get(

        "/profile"

    );


};


export const updateProfile = (data)=>{


    return api.patch(

        "/profile",

        data

    );


};