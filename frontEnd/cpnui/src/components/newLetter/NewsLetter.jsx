import React, { useEffect, useState } from "react";
import style from "./newsLetter.module.css";

const NewsLetter = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    console.log("rendering properly")
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={style.newsletter_box}>
      <h3 className={style.newsletter_title}>Subscribe to receive future updates</h3>
      <p className={style.newsletter_description}>
        Stay up-to-date with our latest news, tips, and resources.
      </p>
      <div className={style.newsletter_form}>
        <input type="text" name="name" placeholder="Enter your name" />
        <input type="email" name="email" placeholder="Enter your email" />
        <input type="submit" value="Subscribe" className={style.subscribe_btn} />
        <p className={style.spam_notice}>
          No spam guaranteed, So please don’t send any spam mail.
        </p>
      </div>

      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={style.toggle_theme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
};

export default NewsLetter;
