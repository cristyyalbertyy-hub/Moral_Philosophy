import { useState } from 'react';
import { chapters, mediaPaths } from '../data/chapters';
import SubchapterPanel from './SubchapterPanel';

export default function Accordion() {
  const [openChapter, setOpenChapter] = useState(null);
  const [openSub, setOpenSub] = useState(null);

  const toggleChapter = (id) => {
    setOpenChapter((prev) => (prev === id ? null : id));
    setOpenSub(null);
  };

  const toggleSub = (chapterId, subId) => {
    const key = `${chapterId}-${subId}`;
    setOpenSub((prev) => (prev === key ? null : key));
  };

  return (
    <nav className="accordion" aria-label="Course chapters">
      {chapters.map((chapter) => {
        const isOpen = openChapter === chapter.id;
        return (
          <section key={chapter.id} className="accordion__chapter">
            <button
              type="button"
              className="accordion__chapter-btn"
              style={{ backgroundColor: chapter.color }}
              aria-expanded={isOpen}
              onClick={() => toggleChapter(chapter.id)}
            >
              <span className="accordion__chapter-text">
                <span className="accordion__chapter-title">{chapter.title}</span>
                <span className="accordion__chapter-count">
                  {chapter.subchapters.length} subchapters
                </span>
              </span>
              <span className={`accordion__chevron${isOpen ? ' accordion__chevron--open' : ''}`}>
                ›
              </span>
            </button>
            {isOpen && (
              <ul className="accordion__subs">
                {chapter.subchapters.map((sub) => {
                  const key = `${chapter.id}-${sub.id}`;
                  const subOpen = openSub === key;
                  const media = mediaPaths(chapter.id, sub);
                  return (
                    <li key={sub.id} className="accordion__sub-item">
                      <button
                        type="button"
                        className="accordion__sub-btn"
                        aria-expanded={subOpen}
                        onClick={() => toggleSub(chapter.id, sub.id)}
                      >
                        <span
                          className="accordion__sub-dot"
                          style={{ backgroundColor: chapter.accent }}
                        />
                        {sub.title}
                        <span
                          className={`accordion__chevron accordion__chevron--sm${
                            subOpen ? ' accordion__chevron--open' : ''
                          }`}
                        >
                          ›
                        </span>
                      </button>
                      {subOpen && (
                        <SubchapterPanel
                          title={sub.title}
                          media={media}
                          accent={chapter.accent}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </nav>
  );
}
