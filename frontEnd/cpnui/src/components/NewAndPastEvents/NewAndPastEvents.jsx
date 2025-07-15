import React from 'react'

function NewAndPastEvents() {
    return (
        <div className="w-full">
            <div className="w-full text-center mb-8 px-4 sm:px-6 lg:px-8">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">EVENTS</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    Connect at <span className="text-amber-600">Our Events</span>
                </h2>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center items-start p-4 sm:p-6 lg:p-8">
                <div className="relative w-full sm:w-80 lg:w-96 xl:w-1/4 min-w-72 p-6 sm:p-8 border border-gray-200 rounded-xl bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer group">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 relative">Upcoming Events</h3>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                </div>

                <div className="relative w-full sm:w-80 lg:w-96 xl:w-1/4 min-w-72 p-6 sm:p-8 border border-gray-200 rounded-xl bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer group">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 relative">Past Events</h3>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}

export default NewAndPastEvents
