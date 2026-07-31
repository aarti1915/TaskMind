import {

    PieChart,

    Pie,

    Cell,

    Tooltip,

    Legend,

    ResponsiveContainer

} from "recharts";


import DashboardCard from "../DashboardCard";





function SubjectDistributionChart({

    data

}){


    return(


        <DashboardCard>


            <h2>

                Subject Study Distribution

            </h2>





            <ResponsiveContainer

            width="100%"

            height={350}

            >


                <PieChart>


                    <Pie

                    data={data}

                    dataKey="total_minutes"

                    nameKey="subject_name"

                    cx="50%"

                    cy="50%"

                    outerRadius={120}

                    label

                    >


                        {

                        data.map(

                            (entry,index)=>(


                                <Cell

                                key={
                                    `cell-${index}`
                                }

                                />


                            )

                        )

                        }


                    </Pie>





                    <Tooltip />



                    <Legend />



                </PieChart>


            </ResponsiveContainer>



        </DashboardCard>


    );


}



export default SubjectDistributionChart;