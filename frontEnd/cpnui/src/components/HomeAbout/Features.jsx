import {Link} from "react-router-dom"
import banner from "../../assets/cpnBanner.png"

const Features = () => {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 flex justify-center items-center flex-col">
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-8 lg:gap-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="w-full lg:w-96 xl:w-[400px] h-80 lg:h-96 xl:h-[400px] bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl">
          <img src={banner} alt="CPN Banner" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-lg lg:max-w-xl xl:max-w-2xl min-w-80 lg:min-w-96">
          <h5 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">ABOUT CPN</h5>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-gray-900 mb-6">
            Empowering Professionals for <span className="text-amber-600">Kingdom Impact</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
            Christian Professionals Network (CPN) is a platform to mentor and raise
            excellent and ethical professionals, who will take over their industries
            and the workplace for The Kingdom, using practical Bible-based principles
            to rise to positions of influence and power in the workplace.
          </p>
          <div className="mt-8">
            <Link 
              to="/insideCPN/about"
              className="inline-block bg-gray-900 hover:bg-amber-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg border-2 border-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50"
            >
              LEARN MORE &rarr;
            </Link>
          </div>
        </div>
      </div>
      
    
      
      {/* <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <iframe 
          className="w-full max-w-4xl mx-auto rounded-xl shadow-2xl" 
          style={{borderRadius:"12px"}} 
          src="https://open.spotify.com/embed/episode/5l3Qlf25FxAblRXsKtEkQC?utm_source=generator" 
          width="100%" 
          height="300" 
          frameBorder="0" 
          allowFullScreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        ></iframe>
      </div> */}
    </section>
  );
};

export default Features;