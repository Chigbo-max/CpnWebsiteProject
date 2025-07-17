import PropTypes from 'prop-types';

function Podcast({ title, embedUrl, topic }) {
    return (
      <div className="podcast-card">
      
        <h3>{title}</h3>
        <iframe
          title={`${title} Player`}
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/${embedUrl}`}
          width="50%"
          height="352"
          frameBorder="0"
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
        <p>{topic}</p>
      </div>
    );
  }
  
  Podcast.propTypes = {
    title: PropTypes.string.isRequired,
    embedUrl: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired
  };

  export default Podcast;