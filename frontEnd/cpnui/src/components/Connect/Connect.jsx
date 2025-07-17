import { useState, useEffect } from "react";

function Connect() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "GET CONNECTED TO A HOME OF AMAZING PROFESSIONALS AND INDUSTRY LEADERS";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const typingSpeed = 100; // Speed in milliseconds
    const pauseTime = 2000; // Pause time at the end

    if (isTyping) {
      if (currentIndex < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, pause before starting over
        const timer = setTimeout(() => {
          setIsTyping(false);
          setCurrentIndex(0);
          setDisplayText("");
        }, pauseTime);
        return () => clearTimeout(timer);
      }
    } else {
      // Start typing again
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTyping]);

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-gray-50">
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-20 min-h-[200px]">
        <div className="h-12 sm:h-16 md:h-20 lg:h-24 flex items-center justify-center">
          <h5 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center w-full max-w-4xl mx-auto">
            <span className="inline-block min-w-[1ch]">
              {displayText}
            </span>
            <span className="inline-block w-2 h-8 bg-gray-900 ml-1 animate-pulse"></span>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Connect;