import {
    deleteSubTopic
} from "../api/subTopics";



function SubTopicList({

    subTopics,

    refresh

}) {



    const removeSubTopic = async(id)=>{


        await deleteSubTopic(id);


        refresh();


    };





    return (

        <div

        style={{

            marginTop:"15px",

            marginLeft:"20px"

        }}

        >


            <h4>
                Sub Topics
            </h4>




            {

            subTopics.map(sub=>(


                <div

                key={
                    sub.sub_topic_id
                }

                style={{

                    background:"white",

                    padding:"10px",

                    marginBottom:"8px",

                    borderRadius:"8px",

                    border:"1px solid #ddd"

                }}

                >



                    <b>
                        {sub.name}
                    </b>



                    <p>
                        {sub.description}
                    </p>





                    <button

                    onClick={()=>


                        removeSubTopic(

                            sub.sub_topic_id

                        )


                    }

                    >

                        Delete

                    </button>




                </div>


            ))

            }





        </div>

    );

}



export default SubTopicList;