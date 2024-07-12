import styles from './bubbleCircle.module.css';
const BubbleCircle = () => {
  return (
    <div className={styles['typing-indicator']}>
      <div className={styles['typing-circle']}></div>
      <div className={styles['typing-circle']}></div>
      <div className={styles['typing-circle']}></div>
      <div className={styles['typing-shadow']}></div>
      <div className={styles['typing-shadow']}></div>
      <div className={styles['typing-shadow']}></div>
    </div>
  );
};

export default BubbleCircle;
