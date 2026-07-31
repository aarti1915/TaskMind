function DashboardMessage({

    message

}){


    return(

        <div

        style={{

            background:"white",

            padding:"30px",

            borderRadius:"12px",

            textAlign:"center",

            marginTop:"20px",

            boxShadow:
            "0 2px 8px rgba(0,0,0,0.1)"

        }}

        >

            <h3>

                {message}

            </h3>


        </div>

    );


}


export default DashboardMessage;