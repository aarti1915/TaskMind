import { useEffect, useState } from "react";


import {

    getDashboardSummary,

    getDailyAnalytics,

    getSubjectProgress,

    getStudyStreak

} from "../api/dashboard";



import DailyStudyChart 
from "../components/charts/DailyStudyChart";


import SubjectDistributionChart 
from "../components/charts/SubjectDistributionChart";


import StreakCard 
from "../components/StreakCard";


import StatCard 
from "../components/StatCard";


import DashboardMessage 
from "../components/DashboardMessage";





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





    const [dailyData,setDailyData] = useState([]);



    const [subjectData,setSubjectData] = useState([]);



    const [streak,setStreak] = useState({

        current_streak:0,

        longest_streak:0,

        last_studied:null

    });





    const [loading,setLoading] = useState(true);



    const [error,setError] = useState("");









    useEffect(()=>{


        loadDashboardData();


    },[]);









    const loadDashboardData = async()=>{


        try{


            setLoading(true);


            setError("");



            await Promise.all([

                loadDashboard(),

                loadDailyAnalytics(),

                loadSubjectProgress(),

                loadStreak()

            ]);



        }


        catch(error){


            console.log(error);



            setError(

                "Unable to load dashboard"

            );


        }


        finally{


            setLoading(false);


        }


    };









    const loadDashboard = async()=>{


        const response =

        await getDashboardSummary();



        setSummary(

            response.data

        );


    };









    const loadDailyAnalytics = async()=>{


        const response =

        await getDailyAnalytics();



        setDailyData(

            response.data

        );


    };









    const loadSubjectProgress = async()=>{


        const response =

        await getSubjectProgress();



        setSubjectData(

            response.data

        );


    };









    const loadStreak = async()=>{


        const response =

        await getStudyStreak();



        setStreak(

            response.data

        );


    };









    const formatStudyTime=(minutes)=>{


        const hours =

        Math.floor(

            minutes / 60

        );



        const mins =

        minutes % 60;




        if(hours===0){


            return `${mins} minutes`;


        }




        return `${hours} hr ${mins} min`;

    };









    if(loading){


        return(

            <DashboardMessage

            message="Loading dashboard..."

            />

        );


    }









    if(error){


        return(

            <DashboardMessage

            message={error}

            />

        );


    }









    return(


        <div>



            <h1>

                Dashboard

            </h1>






            <div

            style={{

                display:"grid",

                gridTemplateColumns:

                "repeat(auto-fit,minmax(220px,1fr))",

                gap:"20px"

            }}

            >




                <StatCard

                title="Subjects"

                value={summary.subjects}

                />




                <StatCard

                title="Topics"

                value={summary.topics}

                />




                <StatCard

                title="Sub Topics"

                value={summary.sub_topics}

                />




                <StatCard

                title="Total Tasks"

                value={summary.total_tasks}

                />




                <StatCard

                title="Completed Tasks"

                value={summary.completed_tasks}

                />




                <StatCard

                title="Pending Tasks"

                value={summary.pending_tasks}

                />




                <StatCard

                title="Study Sessions"

                value={summary.total_sessions}

                />




                <StatCard

                title="Study Time"

                value={

                    formatStudyTime(

                        summary.total_minutes

                    )

                }

                />



            </div>









            {

            dailyData.length > 0 ?


            <DailyStudyChart

                data={dailyData}

            />


            :

            <DashboardMessage

            message="No study sessions available yet"

            />


            }









            {

            subjectData.length > 0 ?


            <SubjectDistributionChart

                data={subjectData}

            />


            :

            <DashboardMessage

            message="No subject study data available yet"

            />


            }









            <StreakCard

                data={streak}

            />





        </div>


    );


}





export default Dashboard;