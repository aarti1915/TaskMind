import DashboardCard from "./DashboardCard";


function StatCard({

    title,

    value

}){


    return(


        <DashboardCard>


            <h3>

                {title}

            </h3>



            <h1>

                {value}

            </h1>



        </DashboardCard>


    );


}


export default StatCard;