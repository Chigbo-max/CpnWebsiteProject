import React from 'react'
import Style from "./NewAndPastEvents.module.css"

function NewAndPastEvents() {
    return (
        <div>
            <div className={Style.textContainer}>
                    <p>EVENTS</p>
                    <h2>Connect at <span>Our Events</span></h2>
                </div>

            <div className={Style.previousAndPastEventsContainer}>
                
                <div className={Style.previousAndPast}>
                    <h3>Upcoming Events</h3>
                </div>

                <div className={Style.previousAndPast}>
                    <h3>Past Events</h3>
                </div>

            </div>



        </div>
    )
}

export default NewAndPastEvents
