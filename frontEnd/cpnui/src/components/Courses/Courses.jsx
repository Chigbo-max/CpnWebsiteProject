import { useNavigate } from 'react-router-dom'

function Courses() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full">
            <div className="flex flex-col justify-center items-center mt-24 md:mt-32 lg:mt-40 w-full text-center px-4 sm:px-6 lg:px-8 py-8">
                <h5 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">COURSES</h5>
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    Our <span className="text-accent-600">Courses</span>
                </h4>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
                    Gather your church community or business network and dive into our courses designed to lay a biblical foundation for faith and work and tools for walking it out together
                </p>
                <button 
                    onClick={() => navigate("/courses")}
                    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 hover:text-accent-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
                >
                    LEARN MORE &rarr;
                </button>
            </div>
        </div>
    )
}

export default Courses
