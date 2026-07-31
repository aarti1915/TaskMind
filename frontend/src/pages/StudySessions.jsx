import {useEffect, useState} from "react";
import api from "../api/axios";


function StudySessions(){

    const [subjects,setSubjects]=useState([]);
    const [topics,setTopics]=useState([]);
    const [subTopics,setSubTopics]=useState([]);

    const [subjectId,setSubjectId]=useState("");
    const [topicId,setTopicId]=useState("");
    const [subTopicId,setSubTopicId]=useState("");

    const [activeSession,setActiveSession]=useState(null);
    const [sessions,setSessions]=useState([]);

    const [timer,setTimer]=useState(0);



    useEffect(()=>{

        loadSubjects();
        loadSessions();
        loadActiveSession();

    },[]);





    const loadSubjects=async()=>{

        try{

            const res = await api.get("/subjects");

            setSubjects(
                res.data?.data || []
            );

        }
        catch(error){

            console.log(error);

            setSubjects([]);

        }

    };





    const loadTopics=async(id)=>{


        setSubjectId(id);
        setTopicId("");
        setSubTopicId("");


        try{


            const res = await api.get(
                `/topics/subject/${id}`
            );


            setTopics(
                res.data?.data || []
            );


            setSubTopics([]);


        }
        catch(error){

            console.log(error);

            setTopics([]);

        }

    };






    const loadSubTopics=async(id)=>{


        setTopicId(id);
        setSubTopicId("");


        try{


            const res = await api.get(
                `/sub-topics/topic/${id}`
            );


            setSubTopics(
                res.data?.data || []
            );


        }
        catch(error){

            console.log(error);

            setSubTopics([]);

        }

    };







    const loadSessions=async()=>{


        try{


            const res = await api.get(
                "/study-sessions"
            );


            // study_sessions API still returns raw array

            setSessions(
                res.data || []
            );


        }
        catch(error){


            console.log(error);

            setSessions([]);


        }


    };








    const loadActiveSession=async()=>{


        try{


            const res = await api.get(
                "/study-sessions/active"
            );


            // study_sessions API still returns raw object

            setActiveSession(
                res.data || null
            );


        }
        catch(error){


            console.log(error);

            setActiveSession(null);


        }


    };







    useEffect(()=>{


        if(!activeSession){

            setTimer(0);

            return;

        }




        const start =

        new Date(
            activeSession.start_time
        ).getTime();





        const update=()=>{


            const now = Date.now();



            const diff =

            Math.floor(

                (now-start)/1000

            );



            setTimer(

                diff > 0 ? diff : 0

            );


        };





        update();



        const interval =

        setInterval(

            update,

            1000

        );





        return ()=>clearInterval(interval);



    },[activeSession]);









    const startSession=async()=>{


        try{


            await api.post(

                "/study-sessions/start",

                {

                    subject_id:Number(subjectId),

                    topic_id:Number(topicId),

                    sub_topic_id:Number(subTopicId)

                }

            );



            await loadActiveSession();

            await loadSessions();



        }
        catch(error){


            console.log(

                error.response?.data

            );


        }


    };








    const endSession=async()=>{


        try{


            await api.patch(

                `/study-sessions/${activeSession.session_id}/end`

            );



            setActiveSession(null);

            setTimer(0);



            await loadSessions();


        }
        catch(error){

            console.log(error);

        }


    };








    const deleteSession=async(id)=>{


        try{


            await api.delete(

                `/study-sessions/${id}`

            );



            await loadSessions();


        }
        catch(error){

            console.log(error);

        }


    };






    const hours = Math.floor(timer/3600);


    const minutes = Math.floor(
        (timer%3600)/60
    );


    const seconds = timer%60;






return(

<div>


<h1>
Study Sessions
</h1>



{

activeSession ?

<div>


<h2>
Session Running
</h2>


<h3>

{hours}h {minutes}m {seconds}s

</h3>



<button onClick={endSession}>

End Session

</button>


</div>



:

<div>



<select

value={subjectId}

onChange={(e)=>
loadTopics(e.target.value)
}

>


<option value="">

Select Subject

</option>


{

subjects.map(subject=>(


<option

key={subject.subject_id}

value={subject.subject_id}

>

{subject.name}

</option>


))

}


</select>







<select

value={topicId}

onChange={(e)=>
loadSubTopics(e.target.value)
}

>


<option value="">

Select Topic

</option>


{

topics.map(topic=>(


<option

key={topic.topic_id}

value={topic.topic_id}

>

{topic.name}

</option>


))

}


</select>







<select

value={subTopicId}

onChange={(e)=>
setSubTopicId(e.target.value)
}

>


<option value="">

Select Sub Topic

</option>


{

subTopics.map(subTopic=>(


<option

key={subTopic.sub_topic_id}

value={subTopic.sub_topic_id}

>

{subTopic.name}

</option>


))

}


</select>





<button onClick={startSession}>

Start Session

</button>


</div>


}






<h2>

Session History

</h2>



{

sessions.map(session=>(


<div

key={session.session_id}

>


<p>

Duration: {session.duration_minutes || 0} minutes

</p>



<button

onClick={()=>
deleteSession(session.session_id)
}

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