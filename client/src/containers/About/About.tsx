import styles from './About.module.scss';

const About: React.FC = () => {
  return (
    <main className={styles['about-page']}>
      <div className={styles['about-content']}>
        <header className={styles['about-header']}>ABOUT RENDERCOVE</header>
        <p>
          RenderCove is a community hub tailored for AI artists to openly share
          their creations and workflows. Emphasizing the journey of creation is
          our core mission. We're passionate about exploring and showcasing the
          diverse workflows of AI art, pushing the boundaries of what's
          possible. Each uploaded image seamlessly integrates its EXIF data,
          offering invaluable insights into the generation process. With
          projects accommodating up to 6 images, users can visually track the
          evolution of their work over time. Fostering connection and
          collaboration is central to our ethos; users can easily follow and
          message their favorite artists. Show your appreciation by liking and
          commenting on projects, nurturing a supportive and interactive
          community.
        </p>
        <p>
          At RenderCove, we believe that the creative process is as important as
          the final artwork itself. That's why we provide a platform where
          artists can delve into the intricate details of their workflows,
          sharing techniques, tools, and insights with one another. Whether
          you're experimenting with neural networks, exploring generative
          algorithms, or refining your digital brushstrokes, RenderCove is your
          haven for artistic exploration and growth. Join our vibrant community
          of AI artists, where inspiration is sparked, skills are honed, and new
          possibilities emerge with every upload.
        </p>
      </div>
    </main>
  );
};

export default About;
