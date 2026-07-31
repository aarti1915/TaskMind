import { useState } from "react";


import {
    deleteSubject
} from "../api/subjects";

import {
    getTopicsBySubject
} from "../api/topics";


import TopicList from "./TopicList";

import AddTopic from "./AddTopic";



function SubjectCard({

    subject,

    refreshSubjects

}) {



    const [topics,setTopics] = useState([]);

    const [showTopics,setShowTopics] = useState(false);

    const [showAdd,setShowAdd] = useState(false);






    const loadTopics = async()=>{


        const response =
        await getTopicsBySubject(

            subject.subject_id

        );



        setTopics(

            response.data

        );



        setShowTopics(true);


    };







    const removeSubject = async()=>{


        await deleteSubject(

            subject.subject_id

        );


        refreshSubjects();


    };






    return (


        <div

        style={{

            background:"white",

            padding:"20px",

            borderRadius:"12px",

            boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"

        }}

        >



            <h2>

                {subject.name}

            </h2>




            <p>

                {subject.description}

            </p>





            <button

            onClick={loadTopics}

            >

                View Topics

            </button>






            <button

            onClick={()=>setShowAdd(!showAdd)}

            >

                Add Topic

            </button>






            <button

            onClick={removeSubject}

            >

                Delete Subject

            </button>








            {

            showAdd &&


            <AddTopic

            subjectId={
                subject.subject_id
            }


            refreshTopics={
                loadTopics
            }


            />

            }







            {

            showTopics &&


            <TopicList

            topics={topics}

            refreshTopics={
                loadTopics
            }

            />


            }





        </div>


    );


}



export default SubjectCard;