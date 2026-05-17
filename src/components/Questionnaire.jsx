import { useEffect, useState } from 'react';
import { parseQuestionCsv } from '../utils/parseCsv';

export default function Questionnaire({ src }) {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setIndex(0);
    setRevealed(false);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load questionnaire');
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseQuestionCsv(text);
        if (!parsed.length) throw new Error('No questions found');
        setCards(parsed);
        setLoading(false);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (loading) return <p className="media-status">Loading questionnaire…</p>;
  if (error) return <p className="media-status media-status--error">{error}</p>;

  const card = cards[index];
  const progress = `${index + 1} / ${cards.length}`;

  return (
    <div className="questionnaire">
      <div className="questionnaire__meta">
        <span className="questionnaire__progress">{progress}</span>
      </div>
      <div className="questionnaire__card">
        <p className="questionnaire__question">{card.question}</p>
        {revealed && (
          <p className="questionnaire__answer">
            <span className="questionnaire__label">Answer</span>
            {card.answer}
          </p>
        )}
      </div>
      <div className="questionnaire__actions">
        {!revealed ? (
          <button type="button" className="btn btn--primary" onClick={() => setRevealed(true)}>
            Show answer
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={index === 0}
              onClick={() => {
                setIndex((i) => i - 1);
                setRevealed(false);
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn--primary"
              disabled={index >= cards.length - 1}
              onClick={() => {
                setIndex((i) => i + 1);
                setRevealed(false);
              }}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
