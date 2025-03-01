import React, { useState, useEffect } from 'react'
import Style from "./Home.module.css"
import Features from "../../components/Features/Features"
import LatestRelease from "../../components/LatestRelease/LatestRelease"
import Courses from "../../components/Courses/Courses"
import FreeContent from '../../components/FreeContent/FreeContent'
import NewAndPastEvents from '../../components/NewAndPastEvents/NewAndPastEvents'
import Cpn1 from "../../assets/cpnevent1.jpg";
import Cpn2 from "../../assets/cpnevent2.jpg"
import Cpn3 from "../../assets/cpnevent3.jpg"
import { motion, AnimatePresence } from 'framer-motion'


const slides = [
  {
    image: Cpn1,
    title: "Christian Professionals Network",
    text: "Raising excellent and ethical professionals, who will take over their industries and the workplace for The Kingdom, using practical Bible-based principles to rise to positions of influence and power in the workplace.",
    buttonText: "About CPN",
    buttonLink: "/About/aboutCPN",
  },
  {
    image: Cpn2,
    title: "Knowledge Hub",
    text: "CPN provides free access to high-quality biblical-based resources for you to learn new things, grow in your fields, be inspired to do bigger things.",
    buttonText: "Explore Our Content",
    buttonLink: "/get-started",
  },
  {
    image: Cpn3,
    title: "Join Our Community",
    text: "Connect and grow with other amazing professionals.",
    buttonText: "Our Community",
    buttonLink: "/community",
  },
];

function Home() {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        (previousIndex + 1) % slides.length);
    }, 10000)

    return () => clearInterval(interval);

  }, [])


  return (
    <div>
      <section className={Style.heroSection}
        >
        <AnimatePresence mode="sync">
          <motion.div
            key={slides[currentIndex].image}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${slides[currentIndex].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
            initial={currentIndex === 0 ? { opacity: 1, scale: 1, x: "0%" } : { opacity: 0, scale: 1.2, x: "100%" }}
            animate={{ opacity: 1, scale: 2, x: "0%" }}
            exit={{ opacity: 1, scale: 2, x: "-100%", position: "absolute" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <div
            className = {Style.backgroundDarkEffect}
            />
          </motion.div>
        </AnimatePresence>

        <div className={Style.hero_content}

        >
          <motion.h2
            key={slides[currentIndex].title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
          >
            {slides[currentIndex].title}
          </motion.h2>
          <motion.p
            key={slides[currentIndex].text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2 }}
          >
            {slides[currentIndex].text}
          </motion.p>
          <motion.a

            key={slides[currentIndex].buttonText}
            href={slides[currentIndex].buttonLink}
            className={Style.cta_btn}
           
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5 }}
          >
            {slides[currentIndex].buttonText}
          </motion.a>

        </div>
      </section>
      <Features />
      <LatestRelease/>
      <Courses/>
      <FreeContent/>
      <NewAndPastEvents/>
                <iframe style={{borderRadius:"12px"}} src="https://open.spotify.com/embed/show/2vmyOcrq7cFcKBMepGbpZP?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

      

                            
   
    </div>


            
      
    
      )
}

      export default Home
