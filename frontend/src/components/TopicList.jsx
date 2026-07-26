import { useState } from "react";


import {
    getSubTopicsByTopic
} from "../api/subTopics";


import {
    deleteTopic
} from "../api/topics";


import AddSubTopic from "./AddSubTopic";

import SubTopicList from "./SubTopicList";



function TopicList({

    topics,

    refreshTopics

}) {



    const [openTopic,setOpenTopic] = useState(null);


    const [subTopics,setSubTopics] = useState([]);

    const [showAdd,setShowAdd] = useState(null);







    const loadSubTopics = async(topicId)=>{


        const response =
        await getSubTopicsByTopic(

            topicId

        );



        setSubTopics(

            response.data

        );


        setOpenTopic(topicId);


    };








    const removeTopic = async(topicId)=>{


        await deleteTopic(

            topicId

        );


        refreshTopics();


    };







    return (


        <div

        style={{

            marginTop:"20px"

        }}

        >



            <h3>
                Topics
            </h3>





            {

            topics.map(topic=>(


                <div

                key={
                    topic.topic_id
                }

                style={{

                    background:"#f8fafc",

                    padding:"15px",

                    marginBottom:"15px",

                    borderRadius:"10px"

                }}

                >





                    <h4>

                        {topic.name}

                    </h4>



                    <p>

                        {topic.description}

                    </p>







                    <button

                    onClick={()=>


                        loadSubTopics(

                            topic.topic_id

                        )


                    }

                    >

                        View Sub Topics

                    </button>






                    <button

                    onClick={()=>


                        setShowAdd(

                            showAdd === topic.topic_id

                            ?

                            null

                            :

                            topic.topic_id

                        )


                    }

                    >

                        Add Sub Topic

                    </button>







                    <button

                    onClick={()=>


                        removeTopic(

                            topic.topic_id

                        )


                    }

                    >

                        Delete Topic

                    </button>







                    {


                    showAdd === topic.topic_id &&


                    <AddSubTopic

                    topicId={
                        topic.topic_id
                    }


                    refreshSubTopics={()=>


                        loadSubTopics(

                            topic.topic_id

                        )


                    }


                    />


                    }








                    {


                    openTopic === topic.topic_id &&


                    <SubTopicList

                    subTopics={subTopics}


                    refresh={()=>


                        loadSubTopics(

                            topic.topic_id

                        )


                    }


                    />


                    }





                </div>


            ))

            }





        </div>


    );


}



export default TopicList;