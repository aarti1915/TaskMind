import {

    LineChart,

    Line,

    XAxis,

    YAxis,

    CartesianGrid,

    Tooltip,

    ResponsiveContainer

} from "recharts";


import DashboardCard from "../DashboardCard";





function DailyStudyChart({

    data

}){


    return(


        <DashboardCard>


            <h2>

                Daily Study Time

            </h2>





            <ResponsiveContainer

            width="100%"

            height={300}

            >


                <LineChart

                data={data}

                >


                    <CartesianGrid

                    strokeDasharray="3 3"

                    />



                    <XAxis

                    dataKey="date"

                    />



                    <YAxis

                    />



                    <Tooltip />



                    <Line

                    type="monotone"

                    dataKey="total_minutes"

                    />


                </LineChart>


            </ResponsiveContainer>



        </DashboardCard>


    );


}



export default DailyStudyChart;