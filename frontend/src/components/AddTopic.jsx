import { useState } from "react";


import {
    createTopic
} from "../api/topics";



function AddTopic({

    subjectId,

    refreshTopics

}) {



    const [name,setName] = useState("");






    const submit = async(e)=>{


        e.preventDefault();



        await createTopic({

            subject_id:subjectId,

            name:name,

            description:""

        });



        setName("");

        refreshTopics();


    };






    return (

        <form

        onSubmit={submit}

        style={{

            marginTop:"15px"

        }}

        >


            <input

            placeholder="Topic name"

            value={name}

            onChange={
                e=>setName(e.target.value)
            }

            />



            <button>

                Add Topic

            </button>



        </form>

    );


}



export default AddTopic;