import React from 'react'

function Events() {
  return (
    <div className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden bg-gray-900 text-white px-8 py-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">Events</h1>
      {/* should contain a list of events for the year
        should be sectioned into events completed and events coming up
        when the user clicks on any the tabs, it should reveal the details of the event including the date,
        time, venue and the title of the event. A map for the venue should also be attached
       */}
      {/* each tab should also have a space for users to register for the event, so the admin receives the details of the 
       registration details peculiar to the event */}
    </div>
  )
}

export default Events
