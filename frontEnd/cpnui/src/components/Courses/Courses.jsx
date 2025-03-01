import React from 'react'
import Style from "./Courses.module.css"
import { useNavigate } from 'react-router-dom'


function Courses() {

    const navigate = useNavigate();
    
    return (
        <div>
            <div className={Style.coursesContainer}>
                <h5>COMMUNITY</h5>
                <h4>Our <span>Courses</span></h4>
                <p>Gather your church community or business network and dive into our courses designed to lay a biblical foundation for faith and work and tools for walking it out together</p>
                <button onClick={() => navigate("/community")}>LEARN MORE &rarr;</button>
            </div>

        </div>
    )
}

export default Courses
