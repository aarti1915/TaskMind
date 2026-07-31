import api from "./axios";





export const getSubTopicsByTopic = async(topicId)=>{


    const response = await api.get(

        `/sub-topics/topic/${topicId}`

    );


    return response.data.data;

};







export const getSubTopics = async()=>{


    const response = await api.get(

        "/sub-topics"

    );


    return response.data.data;

};







export const createSubTopic = async(data)=>{


    const response = await api.post(

        "/sub-topics",

        data

    );


    return response.data.data;

};







export const updateSubTopic = async(id,data)=>{


    const response = await api.patch(

        `/sub-topics/${id}`,

        data

    );


    return response.data.data;

};







export const deleteSubTopic = async(id)=>{


    const response = await api.delete(

        `/sub-topics/${id}`

    );


    return response.data;

};