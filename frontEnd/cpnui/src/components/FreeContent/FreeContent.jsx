import React from 'react'
import { FaBookOpen, FaPodcast } from "react-icons/fa";
import Style from "./FreeContent.module.css"
import {useNavigate} from "react-router-dom"

function FreeContent() {
    const navigate = useNavigate();
    return (
        <div>
            <div className={Style.freeContent}>
                <div className={Style.textContainer}>
                    <h2>Explore Our <span>Free Content</span></h2>
                </div>
                <div className={Style.readAndSeries} onClick ={() => navigate("knowledgeHub/read")}>
                <FaBookOpen className={Style.icon} />
                    <h3>Read</h3>
                    <p>Read our thought leadership and blogs for a redemptive approach to culture, justice, profit, and other challenges we face integrating faith and work.</p>
                    <button onClick ={() => navigate("/knowledgeHub/read")}>WHAT TO READ</button>
                </div>

                <div className={Style.readAndSeries} onClick ={() => navigate("/knowledgeHub/listen")}>
                <FaPodcast className={Style.icon}/> 
                    <h3>Our Series</h3>
                    <p>Discover our podcast series with real-life testimonies from business leaders integrating faith and work, plus practical theology and thought leadership to inspire and guide you in your marketplace calling.</p>
                    <button onClick ={() => navigate("/knowledgeHub/listen")}>VIEW SERIES</button>
                </div>

            </div>

        </div>
    )
}

export default FreeContent
