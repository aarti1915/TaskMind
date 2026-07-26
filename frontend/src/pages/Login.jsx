import { useState } from "react";

import api from "../api/axios";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";




function Login(){


    const {

        login

    } = useAuth();




    const navigate = useNavigate();




    const [form,setForm] = useState({

        email:"",

        password:""

    });







    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:

            e.target.value


        });


    };







    const handleSubmit=async(e)=>{


        e.preventDefault();




        try{


            const response =

            await api.post(

                "/login",

                form

            );





            const token =

            response.data.access_token;





            login(token);





            navigate("/dashboard");





        }

        catch(error){


            console.log(

                error.response?.data

            );


            alert(

                "Invalid email or password"

            );


        }


    };









    return (


        <div

        style={{

            display:"flex",

            justifyContent:"center",

            alignItems:"center",

            minHeight:"100vh"

        }}

        >




            <form

            onSubmit={handleSubmit}

            style={{

                background:"white",

                padding:"30px",

                borderRadius:"12px",

                width:"350px"

            }}

            >



                <h2>

                    Login

                </h2>





                <input

                type="email"

                name="email"

                placeholder="Email"

                value={form.email}

                onChange={handleChange}

                />







                <input

                type="password"

                name="password"

                placeholder="Password"

                value={form.password}

                onChange={handleChange}

                />







                <button

                type="submit"

                >

                    Login

                </button>





            </form>





        </div>


    );


}



export default Login;