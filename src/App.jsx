import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, courseTitle, exitDisciplinesUrl, mediaPaths, overviewImage } from './data/chapters';
import SubchapterPanel from './components/SubchapterPanel';
import { useAuth } from './context/AuthContext';

function collapsedRecord(ids) {
  const init = {};
  for (const id of ids) init[id] = false;
  return init;
}

export default function App() {
  const { userEmail, logout } = useAuth();
  const [openChapters, setOpenChapters] = useState(() =>
    collapsedRecord(chapters.map((c) => c.id)),
  );
  const [selection, setSelection] = useState(null);
  const [atHome, setAtHome] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const mainRef = useRef(null);

  const selected = useMemo(() => {
    if (!selection) return null;
    const chapter = chapters.find((c) => c.id === selection.chapterId);
    const sub = chapter?.subchapters.find((s) => s.id === selection.subId);
    if (!chapter || !sub) return null;
    return { chapter, sub, media: mediaPaths(chapter.id, sub) };
  }, [selection]);

  const isBrowsing = !selected && !atHome;

  const activeChapterId = useMemo(() => {
    if (selected) return selected.chapter.id;
    if (selection && !atHome) return selection.chapterId;
    return chapters.find((c) => openChapters[c.id])?.id ?? null;
  }, [selected, selection, atHome, openChapters]);

  const browsingContext = useMemo(() => {
    if (!selection || selected) return null;
    const chapter = chapters.find((c) => c.id === selection.chapterId);
    if (!chapter) return null;
    return { chapter };
  }, [selection, selected]);

  const mobileLessonContext = useMemo(() => {
    if (selected) {
      return {
        chapter: selected.chapter.title,
        subchapter: selected.sub.title,
        color: selected.chapter.color,
      };
    }
    if (browsingContext) {
      return {
        chapter: browsingContext.chapter.title,
        subchapter: 'Choose a sub-topic',
        color: browsingContext.chapter.color,
      };
    }
    return null;
  }, [selected, browsingContext]);

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null;
  const shellMode = mobileMenuOpen ? 'is-mobile-menu' : 'is-mobile-content';

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">
          Theoretical foundations, clinical ethics, and global context — video, podcast,
          infographic, and questionnaire for each topic.
        </p>
        <ul className="overview-systems" aria-label="Course chapters">
          {chapters.map((chapter) => (
            <li
              key={chapter.id}
              className="overview-systems__item"
              style={{ borderLeftColor: chapter.color }}
            >
              <strong>{chapter.title}</strong>
              <span>
                {chapter.subchapters.length}{' '}
                {chapter.subchapters.length === 1 ? 'sub-topic' : 'sub-topics'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt="Moral Philosophy — course overview"
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a sub-topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
    </div>
  );

  const toggleChapter = (id) => {
    setOpenChapters((o) => ({ ...o, [id]: !o[id] }));
  };

  const selectSubchapter = (chapterId, subId) => {
    setAtHome(false);
    setSelection({ chapterId, subId });
    setMobileMenuOpen(false);

    const next = collapsedRecord(chapters.map((c) => c.id));
    next[chapterId] = true;
    setOpenChapters(next);
  };

  const lessonScrollKey = selected ? `${selected.chapter.id}:${selected.sub.id}` : null;

  useEffect(() => {
    if (!lessonScrollKey) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lessonScrollKey]);

  const goToEntry = () => {
    setAtHome(true);
    setSelection(null);
    setMobileMenuOpen(false);
    setOpenChapters(collapsedRecord(chapters.map((c) => c.id)));
  };

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? ' app-header--compact-mobile' : ''}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img
              src={overviewImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{courseTitle}</h1>
        <div className="app-header__actions">
          <a href={exitDisciplinesUrl} className="progress-link progress-link--header">
            ← All disciplines
          </a>
          {userEmail ? (
            <div className="auth-account">
              <span className="auth-account__email" title={userEmail}>
                {userEmail}
              </span>
              <button type="button" className="btn-ghost" onClick={() => void logout()}>
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={() => setMobileMenuOpen(true)}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <nav className="sidebar" aria-label={courseTitle}>
            {chapters.map((chapter) => {
              const open = openChapters[chapter.id];
              return (
                <div
                  key={chapter.id}
                  className={`accordion accordion--group${open ? ' is-open' : ''}`}
                  data-group={chapter.id}
                >
                  <button
                    type="button"
                    className="accordion-trigger accordion-trigger--group"
                    style={{ backgroundColor: chapter.color }}
                    aria-expanded={open}
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <span className="chevron" aria-hidden>
                      {open ? '▼' : '▶'}
                    </span>
                    <span className="group-name">{chapter.title}</span>
                  </button>
                  {open ? (
                    <div className="sub-tree" style={{ borderTopColor: chapter.accent }}>
                      <ul className="sub-list">
                        {chapter.subchapters.map((sub) => {
                          const active =
                            selection?.chapterId === chapter.id && selection?.subId === sub.id;
                          return (
                            <li key={sub.id}>
                              <button
                                type="button"
                                className={`sub-link${active ? ' active' : ''}`}
                                onClick={() => selectSubchapter(chapter.id, sub.id)}
                              >
                                <span className="sub-link-title">{sub.title}</span>
                                <span className="sub-link-arrow" aria-hidden>
                                  ›
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? ' main--overview' : ''}${isBrowsing ? ' main--browsing' : ''}`}
          data-system-tint={activeChapterId ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : selected ? (
            <div className="subchapter-content">
              <header className="subchapter-head">
                <p className="eyebrow">{selected.chapter.title}</p>
                <h2>{selected.sub.title}</h2>
              </header>
              <SubchapterPanel
                title={selected.sub.title}
                media={selected.media}
                accent={selected.chapter.accent}
                hideTitle
                itemKey={`${selected.chapter.id}/${selected.sub.id}`}
              />
            </div>
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                {browsingContext ? (
                  <>
                    <p className="eyebrow">{browsingContext.chapter.title}</p>
                    <h2 className="browse-title">Choose a sub-topic</h2>
                    <p className="browse-hint">
                      Pick a sub-topic in the menu to open video, podcast, infographic and questions.
                    </p>
                  </>
                ) : (
                  <p>Choose a coloured chapter in the menu on the left, then select a sub-topic.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
