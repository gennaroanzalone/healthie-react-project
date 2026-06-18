import { Board } from './components/Board/Board';
import styles from './App.module.css';

const App = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.portal} aria-hidden="true" />
          Rick &amp; Morty Kanban
        </h1>
        <p className={styles.subtitle}>
          Add a task, assign a character, and drag it across the multiverse.
        </p>
      </header>
      <main className={styles.main}>
        <Board />
      </main>
    </div>
  );
};

export default App;
