import { useEffect, useState } from "react";

import api from "../api/axios";



function Dashboard(){


    const [summary,setSummary] = useState({

        subjects:0,

        topics:0,

        sub_topics:0,

        total_tasks:0,

        completed_tasks:0,

        pending_tasks:0,

        total_sessions:0,

        total_minutes:0

    });







    useEffect(()=>{


        loadDashboard();


    },[]);








    const loadDashboard = async()=>{


        const response = await api.get(

            "/dashboard/summary"

        );


        setSummary(

            response.data

        );


    };







    return (

        <div>


            <h1>
                Dashboard
            </h1>





            <div

            style={{

                display:"grid",

                gridTemplateColumns:

                "repeat(3,1fr)",

                gap:"20px"

            }}

            >





                <Card

                title="Subjects"

                value={summary.subjects}

                />



                <Card

                title="Topics"

                value={summary.topics}

                />



                <Card

                title="Sub Topics"

                value={summary.sub_topics}

                />



                <Card

                title="Total Tasks"

                value={summary.total_tasks}

                />



                <Card

                title="Completed Tasks"

                value={summary.completed_tasks}

                />



                <Card

                title="Pending Tasks"

                value={summary.pending_tasks}

                />



                <Card

                title="Study Sessions"

                value={summary.total_sessions}

                />



                <Card

                title="Study Time"

                value={`${summary.total_minutes} minutes`}

                />



            </div>



        </div>

    );


}







function Card({

    title,

    value

}){


    return (

        <div className="card">


            <h3>

                {title}

            </h3>



            <h1>

                {value}

            </h1>


        </div>

    );


}





export default Dashboard;