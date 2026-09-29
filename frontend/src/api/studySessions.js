import api from "./axios";



// Start Session

export const startSession = (data)=>{


    return api.post(

        "/study-sessions/start",

        data

    );


};




// Log a past session manually (studied outside the app)

export const createManualSession = (data)=>{


    return api.post(

        "/study-sessions/manual",

        data

    );


};





// Get Active Session

export const getActiveSession = ()=>{


    return api.get(

        "/study-sessions/active"

    );


};





// End Session

export const endSession = (id)=>{


    return api.patch(

        `/study-sessions/${id}/end`

    );


};





// Get Session History

export const getStudySessions = ()=>{


    return api.get(

        "/study-sessions"

    );


};





// Delete Session

export const deleteStudySession = (id)=>{


    return api.delete(

        `/study-sessions/${id}`

    );


};