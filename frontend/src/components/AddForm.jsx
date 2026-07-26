import { useState } from "react";


function AddForm({
    type,
    onSubmit,
    onCancel
}) {


    const [name,setName] = useState("");

    const [description,setDescription] = useState("");




    const submitHandler=(e)=>{

        e.preventDefault();


        onSubmit({

            name,

            description

        });


        setName("");

        setDescription("");

    };




    return (

        <form
        onSubmit={submitHandler}
        style={{
            margin:"10px",
            padding:"10px",
            background:"#f5f5f5"
        }}
        >


            <h4>
                Add {type}
            </h4>



            <input

            placeholder={`${type} name`}

            value={name}

            onChange={(e)=>
                setName(e.target.value)
            }

            required

            />



            <br/>



            <input

            placeholder="Description"

            value={description}

            onChange={(e)=>
                setDescription(e.target.value)
            }

            />



            <br/>



            <button type="submit">

            Save

            </button>




            <button

            type="button"

            onClick={onCancel}

            >

            Cancel

            </button>



        </form>


    );

}


export default AddForm;