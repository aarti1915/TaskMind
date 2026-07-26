import { useState } from "react";


import {
    createSubTopic
} from "../api/subTopics";



function AddSubTopic({

    topicId,

    refreshSubTopics

}) {



    const [name,setName] = useState("");







    const submit = async(e)=>{


        e.preventDefault();



        await createSubTopic({

            topic_id:topicId,

            name:name,

            description:""

        });



        setName("");

        refreshSubTopics();


    };








    return (


        <form

        onSubmit={submit}

        style={{

            marginTop:"15px"

        }}

        >


            <input

            placeholder="Sub Topic name"

            value={name}

            onChange={

                e=>setName(e.target.value)

            }

            />





            <button>

                Add Sub Topic

            </button>



        </form>


    );


}



export default AddSubTopic;