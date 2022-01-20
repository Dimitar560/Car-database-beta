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
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </section>
  );
};

export default ExtraDetails;
