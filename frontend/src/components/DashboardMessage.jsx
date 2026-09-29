function DashboardMessage({

    message

}){


    return(

        <div

        className="card"

        style={{

            textAlign:"center",

            marginTop:"20px",

            padding:"30px"

        }}

        >

            <h3>

                {message}

            </h3>


        </div>

    );


}


export default DashboardMessage;