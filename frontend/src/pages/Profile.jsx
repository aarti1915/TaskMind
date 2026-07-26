import { useEffect, useState } from "react";

import { getProfile } from "../api/users";

import { useAuth } from "../context/AuthContext";



function Profile(){


    const { logout } = useAuth();


    const [user,setUser] = useState(null);




    useEffect(()=>{


        loadProfile();


    },[]);





    const loadProfile = async()=>{


        const response = await getProfile();

        setUser(response.data);


    };





    if(!user){

        return (

            <h2>
                Loading Profile...
            </h2>

        );

    }







    return (

        <div>


            <h1>
                Profile
            </h1>




            <div className="card">


                <h2>
                    {user.full_name}
                </h2>


                <p>
                    Email: {user.email}
                </p>


                <p>
                    Study Level: {user.study_level}
                </p>


                <p>
                    Timezone: {user.timezone}
                </p>




            </div>


        </div>

    );


}



export default Profile;