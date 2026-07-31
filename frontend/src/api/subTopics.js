import api from "./axios";




// Get sub topics by topic

export const getSubTopicsByTopic = (topicId)=>{


    return api.get(

        `/sub-topics/topic/${topicId}`

    );


};






// Get all sub topics

export const getSubTopics = ()=>{


    return api.get(

        "/sub-topics"

    );


};







// Create sub topic

export const createSubTopic = (data)=>{


    return api.post(

        "/sub-topics",

        data

    );


};






// Update sub topic

export const updateSubTopic = (id,data)=>{


    return api.patch(

        `/sub-topics/${id}`,

        data

    );


};






// Delete sub topic

export const deleteSubTopic = (id)=>{


    return api.delete(

        `/sub-topics/${id}`

    );


};