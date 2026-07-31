import DashboardCard from "./DashboardCard";


function StreakCard({

    data

}){


    return(


        <DashboardCard>


            <h2>

                Study Streak

            </h2>





            <h3>

                🔥 Current Streak

            </h3>


            <p

            style={{

                fontSize:"28px",

                fontWeight:"bold"

            }}

            >

                {data.current_streak || 0} Days

            </p>






            <h3>

                🏆 Longest Streak

            </h3>



            <p

            style={{

                fontSize:"28px",

                fontWeight:"bold"

            }}

            >

                {data.longest_streak || 0} Days

            </p>






            <small>

                Last Studied:

                {" "}

                {

                    data.last_studied ||

                    "No record"

                }


            </small>



        </DashboardCard>


    );


}



export default StreakCard;