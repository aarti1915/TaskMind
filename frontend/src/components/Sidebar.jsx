import { Link } from "react-router-dom";


function Sidebar(){


return (

<div
style={{
width:"230px",
height:"100vh",
background:"#111827",
color:"white",
padding:"20px",
boxSizing:"border-box"
}}
>


<h2>
TaskMind
</h2>



<nav>


<div>
<Link
to="/dashboard"
style={{
color:"white",
textDecoration:"none"
}}
>
Dashboard
</Link>
</div>



<div>
<Link
to="/study-sessions"
style={{
color:"white",
textDecoration:"none"
}}
>
Study Sessions
</Link>
</div>



<div>
<Link
to="/subjects"
style={{
color:"white",
textDecoration:"none"
}}
>
Subjects
</Link>
</div>



<div>
<Link
to="/profile"
style={{
color:"white",
textDecoration:"none"
}}
>
Profile
</Link>
</div>



</nav>


</div>


);


}


export default Sidebar;