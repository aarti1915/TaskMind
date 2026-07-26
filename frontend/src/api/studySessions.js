import api from "./axios";



// Get all study sessions

export const getStudySessions = ()=>{

    return api.get(
        "/study-sessions"
    );

};




// Create study session

export const createStudySession = (data)=>{

    return api.post(

        "/study-sessions",

        data

    );

};




// Delete study session

export const deleteStudySession = (id)=>{

    return api.delete(

        `/study-sessions/${id}`

    );

};