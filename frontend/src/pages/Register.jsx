import { useState } from "react";
import api from "../api/axios";


function Register() {

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        study_level: ""
    });


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/register",
                formData
            );

            console.log(response.data);

            alert("Registration successful");

        } 
        catch(error) {

            console.log(error.response?.data);

            alert("Registration failed");

        }

    };


    return (

        <div>

            <h2>
                Register
            </h2>


            <form onSubmit={handleSubmit}>


                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                />


                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />


                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />


                <input
                    type="text"
                    name="study_level"
                    placeholder="Study Level"
                    value={formData.study_level}
                    onChange={handleChange}
                />


                <button type="submit">
                    Register
                </button>


            </form>

        </div>

    );

}


export default Register;