import { useState } from "react";
import api from "../api/axios";


function AddSubject({ refreshSubjects }) {


    const [formData, setFormData] = useState({

        name: "",
        description: ""

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


            await api.post(
                "/subjects",
                formData
            );



            setFormData({

                name: "",
                description: ""

            });



            refreshSubjects();



        }
        catch(error) {


            console.log(
                error.response?.data
            );


        }


    };




    return (

        <div

        style={{

            margin:"20px 0",

            padding:"15px",

            border:"1px solid #ddd",

            borderRadius:"10px"

        }}

        >


            <h3>
                Add Subject
            </h3>



            <form onSubmit={handleSubmit}>


                <input

                type="text"

                name="name"

                placeholder="Subject Name"

                value={formData.name}

                onChange={handleChange}

                />



                <input

                type="text"

                name="description"

                placeholder="Description"

                value={formData.description}

                onChange={handleChange}

                />



                <button type="submit">

                    Save Subject

                </button>


            </form>


        </div>


    );


}


export default AddSubject;