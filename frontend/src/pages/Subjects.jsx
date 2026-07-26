import { useEffect, useState } from "react";

import {
    getSubjects,
    createSubject
} from "../api/subjects";


import SubjectCard from "../components/SubjectCard";



function Subjects(){


    const [subjects,setSubjects] = useState([]);


    const [showAdd,setShowAdd] = useState(false);


    const [form,setForm] = useState({

        name:"",

        description:""

    });







    useEffect(()=>{


        loadSubjects();


    },[]);







    const loadSubjects = async()=>{


        try{


            const response =
            await getSubjects();



            setSubjects(
                response.data
            );


        }

        catch(error){


            console.log(
                error.response?.data
            );


        }


    };








    const addSubject = async(e)=>{


        e.preventDefault();



        await createSubject(form);



        setForm({

            name:"",

            description:""

        });



        setShowAdd(false);



        loadSubjects();


    };









    return (

        <div>


            <h1>
                Subjects
            </h1>



            <p>
                Manage Subject → Topic → Sub Topic
            </p>





            <button

            onClick={()=>setShowAdd(!showAdd)}

            >

                Add Subject

            </button>







            {

            showAdd &&


            <form

            onSubmit={addSubject}

            style={{

                background:"white",

                padding:"20px",

                marginTop:"15px",

                borderRadius:"10px"

            }}

            >


                <input

                placeholder="Subject Name"

                value={form.name}

                onChange={e=>

                    setForm({

                        ...form,

                        name:e.target.value

                    })

                }

                />





                <input

                placeholder="Description"

                value={form.description}

                onChange={e=>

                    setForm({

                        ...form,

                        description:e.target.value

                    })

                }

                />





                <button>

                    Save Subject

                </button>



            </form>


            }









            <div

            style={{

                marginTop:"25px",

                display:"grid",

                gap:"20px"

            }}

            >



            {

            subjects.map(subject=>(


                <SubjectCard


                key={
                    subject.subject_id
                }


                subject={subject}


                refreshSubjects={
                    loadSubjects
                }


                />


            ))

            }



            </div>



        </div>


    );


}



export default Subjects;