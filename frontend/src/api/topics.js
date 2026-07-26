import api from "./axios";




// Get all topics

export const getTopics = ()=>{


    return api.get(

        "/topics"

    );


};





// Get topics by subject

export const getTopicsBySubject = (subjectId)=>{


    return api.get(

        `/subjects/${subjectId}/topics`

    );


};





// Create topic

export const createTopic = (data)=>{


    return api.post(

        "/topics",

        data

    );


};





// Update topic

export const updateTopic = (id,data)=>{


    return api.patch(

        `/topics/${id}`,

        data

    );


};





// Delete topic

export const deleteTopic = (id)=>{


    return api.delete(

        `/topics/${id}`

    );


};