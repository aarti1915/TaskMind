import { useAuth } from "../context/AuthContext";



function Navbar(){


    const {
        logout
    } = useAuth();





    return (

        <header

        style={{

            background:"white",

            padding:"15px 25px",

            borderRadius:"10px",

            display:"flex",

            justifyContent:"space-between",

            alignItems:"center"

        }}

        >



            <h3>

                TaskMind

            </h3>





            <button

            onClick={logout}

            >

                Logout

            </button>





        </header>

    );


}



export default Navbar;