import { useState } from 'react';
import Questionnaire from './Questionnaire';

const TABS = [
  { id: 'video', label: 'Video', icon: '▶' },
  { id: 'podcast', label: 'Podcast', icon: '♪' },
  { id: 'infographic', label: 'Infographic', icon: '◫' },
  { id: 'questionnaire', label: 'Questionnaire', icon: '?' },
];

export default function SubchapterPanel({ title, media, accent }) {
  const [tab, setTab] = useState('video');

  return (
    <div className="subchapter-panel">
      <h3 className="subchapter-panel__title" style={{ borderColor: accent }}>
        {title}
      </h3>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`tabs__btn${tab === t.id ? ' tabs__btn--active' : ''}`}
            style={tab === t.id ? { backgroundColor: accent, borderColor: accent } : undefined}
            onClick={() => setTab(t.id)}
          >
            <span className="tabs__icon" aria-hidden>
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </div>
      <div className="media-view" role="tabpanel">
        {tab === 'video' && (
          <video className="media-view__video" controls preload="metadata" src={media.video}>
            Your browser does not support video playback.
          </video>
        )}
        {tab === 'podcast' && (
          <div className="media-view__audio-wrap">
            <audio className="media-view__audio" controls preload="metadata" src={media.podcast}>
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
        {tab === 'infographic' && (
          <img
            className="media-view__image"
            src={media.infographic}
            alt={`${title} infographic`}
            loading="lazy"
          />
        )}
        {tab === 'questionnaire' && <Questionnaire src={media.questionnaire} />}
      </div>
    </div>
  );
}
