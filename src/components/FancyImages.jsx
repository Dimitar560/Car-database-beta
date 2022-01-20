import "../styles/FancyImages.css";
import fancyCarImages from "../javaScript/fancyCarImages";

const FancyImages = () => {
  const fancyImgGen = (fancy) => {
    return (
      <img
        className="styled-images"
        src={fancy.src}
        alt={fancy.alt}
        key={fancy.id}
      />
    );
  };

  return (
    <section id="fancy-images">
      {fancyCarImages.map(fancyImgGen)}
      <h4 className="fancy-titles-1">Filled database</h4>
      <h4 className="fancy-titles-2">Awsome brands</h4>
      <h4 className="fancy-titles-3">Engine information</h4>
    </section>
  );
};

export default FancyImages;
