import { Outlet, NavLink } from "react-router-dom";

import Navbar from "./Navbar";



function Layout(){



    return (


        <div

        style={{

            display:"flex",

            minHeight:"100vh",

            background:"#f1f3f7"

        }}

        >





            <aside

            style={{

                width:"220px",

                background:"#111827",

                color:"white",

                padding:"25px"

            }}

            >



                <h2>

                    TaskMind

                </h2>





                <nav

                style={{

                    marginTop:"30px",

                    display:"flex",

                    flexDirection:"column",

                    gap:"15px"

                }}

                >




                    <NavLink

                    to="/dashboard"

                    style={{

                        color:"white",

                        textDecoration:"none"

                    }}

                    >

                        Dashboard

                    </NavLink>






                    <NavLink

                    to="/subjects"

                    style={{

                        color:"white",

                        textDecoration:"none"

                    }}

                    >

                        Subjects

                    </NavLink>







                    <NavLink

                    to="/study-sessions"

                    style={{

                        color:"white",

                        textDecoration:"none"

                    }}

                    >

                        Study Sessions

                    </NavLink>







                    <NavLink

                    to="/profile"

                    style={{

                        color:"white",

                        textDecoration:"none"

                    }}

                    >

                        Profile

                    </NavLink>


                    <NavLink

                    to="/planner"

                    style={{
                        color:"white",
                        textDecoration:"none"
                    }}

                    >

                    Daily Planner

                    </NavLink>





                </nav>




            </aside>









            <main

            style={{

                flex:1,

                padding:"20px"

            }}

            >




                <Navbar />





                <div

                style={{

                    marginTop:"20px",

                    background:"#f8fafc",

                    padding:"25px",

                    minHeight:"80vh"

                }}

                >


                    <Outlet />


                </div>





            </main>





        </div>


    );


}



export default Layout;