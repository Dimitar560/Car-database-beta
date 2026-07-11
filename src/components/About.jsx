import { Fragment } from "react";
import NavBar from "./NavBar";
import "../styles/About.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/About.css";

import SwiperCore, { Parallax, Pagination, Navigation } from "swiper";

const About = () => {
  SwiperCore.use([Parallax, Pagination, Navigation]);
  return (
    <Fragment>
      <NavBar />

      <Swiper
        style={{
          "--swiper-navigation-color": "#101820ff",
        }}
        speed={600}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper"
      >
        <div
          slot="container-start"
          className="parallax-bg"
          data-swiper-parallax="-23%"
        ></div>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
            We want to develop with your help
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            Join our community
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
              This group's mission is to create a global community of diverse
              individuals who will support, challenge, and inspire one another
              by providing a platform for networking, mentorship, and career
              development. We encourage you to share your knowledge, ask
              questions, participate in discussions and become an integral part
              of this little community. Together we can become better community
              leaders and provide our members with a much better experience.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
            Current location
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            Sofia,Bulgaria
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>Before the way to the airport</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="title" data-swiper-parallax="-300">
            Contacts
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            Find us at:
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>Phone: +359 87 888 8888 </p>
            <p>Email: OurFirm@email.com</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </Fragment>
  );
};

export default About;
