import Accordion from './components/Accordion';
import ProgressLink from './components/ProgressLink';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <ProgressLink className="progress-link--header" compact />
        <p className="header__eyebrow">Learning platform</p>
        <h1 className="header__title">Moral Philosophy</h1>
        <p className="header__subtitle">
          Theoretical foundations, clinical ethics, and global context — video, podcast,
          infographic, and questionnaire for each topic.
        </p>
        <p className="header__progress">
          Already enrolled? <ProgressLink className="progress-link--inline" />
        </p>
      </header>
      <main className="main">
        <Accordion />
      </main>
      <footer className="footer">
        <p>Select a chapter, then a subchapter, to explore the materials.</p>
        <ProgressLink className="progress-link--footer" />
      </footer>
    </div>
  );
}
