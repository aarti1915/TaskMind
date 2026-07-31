import { useEffect, useState } from "react";

import api from "../api/axios";



function Planner(){


    const [subjects,setSubjects] = useState([]);

    const [topics,setTopics] = useState([]);

    const [subTopics,setSubTopics] = useState([]);



    const [tasks,setTasks] = useState([]);

    const [todayTasks,setTodayTasks] = useState([]);

    const [upcomingTasks,setUpcomingTasks] = useState([]);



    const [loading,setLoading] = useState(false);

    const [editId,setEditId] = useState(null);



    const [filter,setFilter] = useState("ALL");

    const [sort,setSort] = useState("NEWEST");



    const emptyForm = {

        title:"",

        description:"",

        subject_id:"",

        topic_id:"",

        sub_topic_id:"",

        priority:"MEDIUM",

        due_date:""

    };



    const [form,setForm] = useState(emptyForm);






    useEffect(()=>{


        loadSubjects();

        loadTasks();

        loadPlannerViews();


    },[]);








    const loadSubjects = async()=>{


        try{


            const response = await api.get(

                "/subjects"

            );


            setSubjects(

                response.data.data || []

            );


        }

        catch(error){


            console.log(error);

            setSubjects([]);


        }


    };








    const loadTasks = async()=>{


        try{


            const response = await api.get(

                "/tasks"

            );


            setTasks(

                response.data.data || []

            );


        }

        catch(error){


            console.log(error);

            setTasks([]);


        }


    };








    const loadPlannerViews = async()=>{


        try{


            const today = await api.get(

                "/tasks/today"

            );



            const upcoming = await api.get(

                "/tasks/upcoming"

            );



            setTodayTasks(

                today.data?.data || []

            );



            setUpcomingTasks(

                upcoming.data?.data || []

            );


        }

        catch(error){


            console.log(error);


            setTodayTasks([]);

            setUpcomingTasks([]);


        }


    };








    const subjectChange = async(e)=>{


        const subjectId = e.target.value;



        setForm({

            ...form,

            subject_id:subjectId,

            topic_id:"",

            sub_topic_id:""

        });



        setTopics([]);

        setSubTopics([]);




        if(subjectId){


            const response = await api.get(

                `/topics/subject/${subjectId}`

            );



            setTopics(

                response.data.data || []

            );


        }


    };








    const topicChange = async(e)=>{


        const topicId = e.target.value;



        setForm({

            ...form,

            topic_id:topicId,

            sub_topic_id:""

        });



        setSubTopics([]);



        if(topicId){


            const response = await api.get(

                `/sub-topics/topic/${topicId}`

            );



            setSubTopics(

                response.data.data || []

            );


        }


    };








    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:

            e.target.value


        });


    };








    const refreshTasks=()=>{


        loadTasks();

        loadPlannerViews();


    };








    const saveTask = async(e)=>{


        e.preventDefault();


        setLoading(true);




        try{


            if(editId){


                await api.patch(

                    `/tasks/${editId}`,

                    {


                        title:form.title,

                        description:form.description,

                        priority:form.priority,

                        due_date:form.due_date


                    }

                );


            }

            else{


                await api.post(

                    "/tasks",

                    form

                );


            }



            setForm(emptyForm);

            setEditId(null);


            refreshTasks();


        }

        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    };








    const editTask=(task)=>{


        setEditId(

            task.task_id

        );



        setForm({


            title:task.title,

            description:task.description || "",

            subject_id:task.subject_id,

            topic_id:task.topic_id,

            sub_topic_id:task.sub_topic_id,

            priority:task.priority,

            due_date:task.due_date


        });


    };








    const completeTask = async(id)=>{


        await api.patch(

            `/tasks/${id}/complete`

        );


        refreshTasks();


    };








    const deleteTask = async(id)=>{


        await api.delete(

            `/tasks/${id}`

        );


        refreshTasks();


    };








    const cancelEdit=()=>{


        setEditId(null);

        setForm(emptyForm);


    };








    const filteredTasks = tasks

        .filter(task=>{


            if(filter==="ALL")

                return true;



            if(filter==="PENDING")

                return task.status==="PENDING";



            if(filter==="COMPLETED")

                return task.status==="COMPLETED";



            if(filter==="HIGH")

                return task.priority==="HIGH";



            if(filter==="MEDIUM")

                return task.priority==="MEDIUM";



            if(filter==="LOW")

                return task.priority==="LOW";



            return true;


        })

        .sort((a,b)=>{


            if(sort==="DUE_DATE"){


                return new Date(a.due_date)-new Date(b.due_date);


            }



            if(sort==="PRIORITY"){


                const priority={

                    HIGH:1,

                    MEDIUM:2,

                    LOW:3

                };


                return priority[a.priority]-priority[b.priority];


            }



            if(sort==="OLDEST"){


                return a.task_id-b.task_id;


            }



            return b.task_id-a.task_id;


        });

        return (

<div>


<h1>

Daily Planner

</h1>





<form

onSubmit={saveTask}

className="card"

>



<input

name="title"

placeholder="Task title"

value={form.title}

onChange={handleChange}

required

/>





<textarea

name="description"

placeholder="Description"

value={form.description}

onChange={handleChange}

/>







<select

value={form.subject_id}

onChange={subjectChange}

required

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

value={form.topic_id}

onChange={topicChange}

required

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

name="sub_topic_id"

value={form.sub_topic_id}

onChange={handleChange}

required

>


<option value="">

Select Sub Topic

</option>



{

subTopics.map(sub=>(


<option

key={sub.sub_topic_id}

value={sub.sub_topic_id}

>

{sub.name}

</option>


))

}


</select>







<select

name="priority"

value={form.priority}

onChange={handleChange}

>


<option value="LOW">

Low

</option>


<option value="MEDIUM">

Medium

</option>


<option value="HIGH">

High

</option>


</select>







<input

type="date"

name="due_date"

value={form.due_date}

onChange={handleChange}

required

/>





<button

disabled={loading}

>

{

editId

?

"Update Task"

:

"Create Task"

}

</button>






{

editId &&


<button

type="button"

onClick={cancelEdit}

>

Cancel

</button>


}


</form>








<div

className="card"

>


<h2>

Task Filters

</h2>




<select

value={filter}

onChange={(e)=>setFilter(e.target.value)}

>


<option value="ALL">

All

</option>


<option value="PENDING">

Pending

</option>


<option value="COMPLETED">

Completed

</option>


<option value="HIGH">

High Priority

</option>


<option value="MEDIUM">

Medium Priority

</option>


<option value="LOW">

Low Priority

</option>


</select>







<select

value={sort}

onChange={(e)=>setSort(e.target.value)}

>


<option value="NEWEST">

Newest

</option>


<option value="OLDEST">

Oldest

</option>


<option value="DUE_DATE">

Due Date

</option>


<option value="PRIORITY">

Priority

</option>


</select>


</div>







<TaskSection

title="All Tasks"

tasks={filteredTasks}

editTask={editTask}

completeTask={completeTask}

deleteTask={deleteTask}

/>





<TaskSection

title="Today's Tasks"

tasks={todayTasks}

/>





<TaskSection

title="Upcoming Tasks"

tasks={upcomingTasks}

/>





</div>


);

}




function TaskSection({

title,

tasks,

editTask,

completeTask,

deleteTask

}){


return(

<div>


<h2>

{title}

</h2>




{

tasks.length===0

?

<p>

No tasks available

</p>


:


tasks.map(task=>(


<div

className="card"

key={task.task_id}

>


<h3>

{task.title}

</h3>




<p>

Subject:

{" "}

{task.subject?.name || task.subject_name || "-"}

</p>




<p>

Topic:

{" "}

{task.topic?.name || task.topic_name || "-"}

</p>




<p>

Sub Topic:

{" "}

{task.sub_topic?.name || task.sub_topic_name || "-"}

</p>




<p>

Priority:

{" "}

{task.priority}

</p>




<p>

Status:

{" "}

{task.status}

</p>




<p>

Due:

{" "}

{task.due_date}

</p>






{

editTask &&


<button

onClick={()=>editTask(task)}

>

Edit

</button>


}






{

completeTask &&


<button

onClick={()=>completeTask(task.task_id)}

>

Complete

</button>


}






{

deleteTask &&


<button

onClick={()=>deleteTask(task.task_id)}

>

Delete

</button>


}



</div>


))


}


</div>

);


}




export default Planner;