import "../styles/Footer.css";
import facebookIcon from "../icons/facebook.png";
import instagramIcon from "../icons/instagram.png";
import twitterIcon from "../icons/twitter.png";

const Footer = () => {
  const date = new Date();
  const options = { year: "numeric" };
  const year = date.toLocaleDateString("en-BG", options);
  return (
    <footer className="footer">
      <p className="footer-text-copyright">Copyright &copy; D.C {year}</p>
      <p className="footer-text-contact">Contact us</p>
      <br />
      <img className="footer-icon-1" src={facebookIcon} alt="facebookIcon" />
      <img className="footer-icon-2" src={instagramIcon} alt="facebookIcon" />
      <img className="footer-icon-3" src={twitterIcon} alt="facebookIcon" />
    </footer>
  );
};

export default Footer;
