import { NavBar } from '../../components/NavBar'
import { Carousel } from '../../components/Carousel'
import styles from './About.module.css'

export function About() {
  return (
    <>
      <NavBar />
      <Carousel draggable>
        <div className={styles.slideContent}>
          <div className={styles.title}>We want to develop with your help</div>
          <div className={styles.subtitle}>Join our community</div>
          <div className={styles.text}>
            <p>
              This group&apos;s mission is to create a global community of diverse individuals who will support,
              challenge, and inspire one another by providing a platform for networking, mentorship, and career
              development. We encourage you to share your knowledge, ask questions, participate in discussions and
              become an integral part of this little community. Together we can become better community leaders
              and provide our members with a much better experience.
            </p>
          </div>
        </div>
        <div className={styles.slideContent}>
          <div className={styles.title}>Current location</div>
          <div className={styles.subtitle}>Sofia, Bulgaria</div>
          <div className={styles.text}>
            <p>Before the way to the airport</p>
          </div>
        </div>
        <div className={styles.slideContent}>
          <div className={styles.title}>Contacts</div>
          <div className={styles.subtitle}>Find us at:</div>
          <div className={styles.text}>
            <p>Phone: +359 87 888 8888</p>
            <p>Email: OurFirm@email.com</p>
          </div>
        </div>
      </Carousel>
    </>
  )
}
