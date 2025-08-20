import Webcam from '../components/Webcam';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Webcam />
      </main>
    </div>
  );
}