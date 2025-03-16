import React from 'react'
import NewsLetter from "../../components/newLetter/NewsLetter";
import style from "./contactUs.module.css"; 
import bgImage from "../../assets/contact.jpeg"
import { motion } from "framer-motion"; 


const Contact = () => {
  return (
    <div className={style.contact}>
    <div className={style.otherHeroSection}
       style={{
        background: `linear-gradient(rgba(61, 35, 27, 0.85), rgba(61, 35, 27, 0.85)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        <motion.h1 
        initial={{ x: "-100vw", opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        
        ><span>Contact</span> Us</motion.h1>
        <motion.p
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >Do you have questions about how to take our resources into your community? Do you have a topic suggestion? Do you want to know more about how you can engage further in the faith and work space in your region or are there other initiatives that you want us to know about? Please get in touch!</motion.p>
        </div>
    <section id="contact" className={style.contact_section}>

      <div className={style.container}>
        <div className={style.contact_wrapper}>
          <div className={style.contact_form_container}>
            <div className={style.contact_form_box}>
              <h2>Get in Touch</h2>
              <p>Our support team will get back to you ASAP via email.</p>
              <form>
                <div className={style.form_group}>
                  <div className={style.input_container}>
                    <label htmlFor="name">Your Name</label>
                    <input type="text" placeholder="Enter your name" id="name" />
                  </div>
                  <div className={style.input_container}>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" placeholder="Enter your email" id="email" />
                  </div>
                </div>
                <div className={style.textarea_container}>
                  <label htmlFor="message">Your Message</label>
                  <textarea name="message" rows={5} placeholder="Enter your Message" id="message"></textarea>
                </div>
                <button type="submit" className={style.submit_button}>Submit Ticket</button>
              </form>
            </div>
          </div>
          <div className={style.newsletter_box}>
            <NewsLetter/>
          </div>
          <div className={style.protection}>
          <h3>Nigeria Data Protection Regulation (NDPR), 2019</h3>
          <p>We are committed to protecting your privacy. Whenever you use our website, complete an application form or contact us electronically, you consent to our processing of your personal information in accordance with the requirements of NDPR. In the event that you wish to revoke your consent, please send an email to cprofessionalsnetwork@gmail.com.</p>
          </div>
        </div>
      </div>

    </section>
    </div>
  );
};

export default Contact;




