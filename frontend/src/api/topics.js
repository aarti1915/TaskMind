import api from "./axios";





// Get all topics

export const getTopics = async()=>{


    const response = await api.get(

        "/topics"

    );


    return response.data.data;

};









// Get topics by subject

export const getTopicsBySubject = async(subjectId)=>{


    const response = await api.get(

        `/topics/subject/${subjectId}`

    );


    return response.data.data;

};









// Create topic

export const createTopic = async(data)=>{


    const response = await api.post(

        "/topics",

        data

    );


    return response.data.data;

};









// Update topic

export const updateTopic = async(id,data)=>{


    const response = await api.patch(

        `/topics/${id}`,

        data

    );


    return response.data.data;

};









// Delete topic

export const deleteTopic = async(id)=>{


    const response = await api.delete(

        `/topics/${id}`

    );


    return response.data;

};