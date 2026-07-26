import { useEffect, useState } from "react";


import {
    getSubjects
} from "../api/subjects";


import {
    getTopicsBySubject
} from "../api/topics";


import {
    getSubTopicsByTopic
} from "../api/subTopics";


import {
    getStudySessions,
    createStudySession,
    deleteStudySession
} from "../api/studySessions";





function StudySessions(){



    const [subjects,setSubjects] = useState([]);

    const [topics,setTopics] = useState([]);

    const [subTopics,setSubTopics] = useState([]);

    const [sessions,setSessions] = useState([]);





    const [form,setForm] = useState({

        subject_id:"",

        topic_id:"",

        sub_topic_id:"",

        study_date:"",

        duration_minutes:"",

        notes:""

    });








    useEffect(()=>{


        loadSubjects();

        loadSessions();


    },[]);









    const loadSubjects = async()=>{


        const res =
        await getSubjects();


        setSubjects(
            res.data
        );


    };







    const loadSessions = async()=>{


        try{


            const res =
            await getStudySessions();


            setSessions(
                res.data
            );


        }

        catch(error){


            console.log(
                error.response?.data
            );


        }


    };









    const selectSubject = async(e)=>{


        const subjectId =
        e.target.value;



        setForm({

            ...form,

            subject_id:subjectId,

            topic_id:"",

            sub_topic_id:""

        });



        setTopics([]);

        setSubTopics([]);




        if(subjectId){


            const res =
            await getTopicsBySubject(
                subjectId
            );


            setTopics(
                res.data
            );


        }


    };









    const selectTopic = async(e)=>{


        const topicId =
        e.target.value;



        setForm({

            ...form,

            topic_id:topicId,

            sub_topic_id:""

        });



        setSubTopics([]);




        if(topicId){


            const res =
            await getSubTopicsByTopic(
                topicId
            );


            setSubTopics(
                res.data
            );


        }


    };









    const changeHandler=(e)=>{


        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });


    };









    const saveSession=async(e)=>{


        e.preventDefault();



        await createStudySession(form);



        setForm({

            subject_id:"",

            topic_id:"",

            sub_topic_id:"",

            study_date:"",

            duration_minutes:"",

            notes:""

        });



        setTopics([]);

        setSubTopics([]);



        loadSessions();


    };









    const removeSession=async(id)=>{


        await deleteStudySession(id);


        loadSessions();


    };








    return (

        <div>


            <h1>
                Study Sessions
            </h1>





            <form

            onSubmit={saveSession}

            >




            <select

            value={form.subject_id}

            onChange={selectSubject}

            >

                <option value="">
                    Select Subject
                </option>


                {
                subjects.map(s=>(

                    <option

                    key={s.subject_id}

                    value={s.subject_id}

                    >

                    {s.name}

                    </option>

                ))
                }


            </select>






            <select

            value={form.topic_id}

            onChange={selectTopic}

            >

                <option value="">
                    Select Topic
                </option>



                {
                topics.map(t=>(

                    <option

                    key={t.topic_id}

                    value={t.topic_id}

                    >

                    {t.name}

                    </option>

                ))
                }


            </select>







            <select

            name="sub_topic_id"

            value={form.sub_topic_id}

            onChange={changeHandler}

            >

                <option value="">
                    Select Sub Topic
                </option>



                {
                subTopics.map(s=>(

                    <option

                    key={s.sub_topic_id}

                    value={s.sub_topic_id}

                    >

                    {s.name}

                    </option>

                ))
                }


            </select>







            <input

            type="date"

            name="study_date"

            value={form.study_date}

            onChange={changeHandler}

            />







            <input

            type="number"

            name="duration_minutes"

            placeholder="Duration"

            value={form.duration_minutes}

            onChange={changeHandler}

            />







            <textarea

            name="notes"

            placeholder="Notes"

            value={form.notes}

            onChange={changeHandler}

            />






            <button>

                Add Session

            </button>



            </form>







            <h2>
                Previous Sessions
            </h2>





            {

            sessions.map(session=>(


                <div

                key={
                    session.session_id
                }

                >


                    <p>

                    {session.study_date}

                    </p>



                    <p>

                    {session.duration_minutes}
                    minutes

                    </p>



                    <button

                    onClick={()=>removeSession(
                        session.session_id
                    )}

                    >

                    Delete

                    </button>



                </div>


            ))

            }





        </div>


    );


}



export default StudySessions;