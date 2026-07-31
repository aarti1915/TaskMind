import DashboardCard from "./DashboardCard";


function WeeklyStudyCard({data}){


    if(!data){

        return null;

    }



    return(

        <DashboardCard>


            <h2>

                This Week

            </h2>



            <p>

                Total Study Time:

            </p>


            <h3>

                {data.formatted_time}

            </h3>



            <p>

                Sessions:

                {" "}

                {data.total_sessions}

            </p>



        </DashboardCard>

    );


}


export default WeeklyStudyCard;