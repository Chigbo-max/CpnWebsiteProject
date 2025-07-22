import { useNavigate } from 'react-router-dom'

function Courses() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full">
            <div className="flex flex-col justify-center items-center mt-24 md:mt-32 lg:mt-40 w-full text-center px-4 sm:px-6 lg:px-8 py-8">
                <h5 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">COURSES</h5>
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Our <span className="text-amber-600">Courses</span>
                </h4>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 px-4">
                    Gather your church community or business network and dive into our courses designed to lay a biblical foundation for faith and work and tools for walking it out together
                </p>
                <button 
                    onClick={() => navigate("/community")}
                    className="bg-gray-900 hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
                >
                    LEARN MORE &rarr;
                </button>
            </div>
        </div>
    )
}

export default Courses
