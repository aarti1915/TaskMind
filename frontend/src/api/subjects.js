import api from "./axios";





// Get all subjects

export const getSubjects = async()=>{


    const response =

    await api.get(

        "/subjects"

    );



    return response.data.data;

};







// Create subject

export const createSubject = async(data)=>{


    const response =

    await api.post(

        "/subjects",

        data

    );



    return response.data.data;

};







// Update subject

export const updateSubject = async(id,data)=>{


    const response =

    await api.patch(

        `/subjects/${id}`,

        data

    );



    return response.data.data;

};







// Delete subject

export const deleteSubject = async(id)=>{


    const response =

    await api.delete(

        `/subjects/${id}`

    );



    return response.data;

};