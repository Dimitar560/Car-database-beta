import "../styles/ExtraDetails.css";

const ExtraDetails = () => {
  return (
    <section className="extra-details">
      <h3 className="extra-title">
        There is e<span className="other-side">ven more.</span>
        <br />
        Information on old
        <span className="other-side"> but gold machines.</span>
      </h3>
      <img
        className="extra-image"
        src="https://live.staticflickr.com/65535/49552961191_927f5ffcd4_b.jpg"
        alt="mustang"
      />
      <p className="extra-text">
        A classic car is an older car, typically 25 years or older, though
        definitions vary. The common theme is of an older car of historical
        interest to be collectible and tend to be restored rather than scrapped.
        Classic cars are a subset of a broader category of "collector cars". A
        subset of what is considered classic cars are known as antique cars or
        vintage cars Organizations such as the Classic Car Club of America
        maintain lists of eligible unmodified cars that are called "classic".
        These are described as "fine" or "distinctive" automobile, either
        American or foreign built, produced between 1915 and 1948.
      </p>
    </section>
  );
};

export default ExtraDetails;
