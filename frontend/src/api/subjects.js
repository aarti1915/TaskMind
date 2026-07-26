import api from "./axios";



// Get all subjects

export const getSubjects = ()=>{

    return api.get(
        "/subjects"
    );

};




// Create subject

export const createSubject = (data)=>{

    return api.post(

        "/subjects",

        data

    );

};




// Update subject

export const updateSubject = (id,data)=>{


    return api.patch(

        `/subjects/${id}`,

        data

    );


};




// Delete subject

export const deleteSubject = (id)=>{


    return api.delete(

        `/subjects/${id}`

    );


};




// Get topics of subject

export const getSubjectTopics = (id)=>{


    return api.get(

        `/subjects/${id}/topics`

    );


};