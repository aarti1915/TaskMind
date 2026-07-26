import { useEffect, useState } from "react";

import api from "../api/axios";



function Dashboard(){


    const [summary,setSummary] = useState({

        total_sessions:0,

        formatted_time:"0 min",

        subjects:0,

        topics:0,

        sub_topics:0

    });





    useEffect(()=>{


        loadDashboard();


    },[]);







    const loadDashboard = async()=>{


        const response = await api.get(

            "/dashboard/summary"

        );


        setSummary(response.data);


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

                title="Study Sessions"

                value={
                    summary.total_sessions
                }

                />



                <Card

                title="Study Time"

                value={
                    summary.formatted_time
                }

                />



                <Card

                title="Subjects"

                value={
                    summary.subjects
                }

                />



                <Card

                title="Topics"

                value={
                    summary.topics
                }

                />



                <Card

                title="Sub Topics"

                value={
                    summary.sub_topics
                }

                />


            </div>



        </div>

    );

}





function Card({title,value}){


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