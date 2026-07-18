import { useEffect, useRef, useState } from 'react';
import Questionnaire from './Questionnaire';
import { useMediaProgress } from '../hooks/useMediaProgress';
import { bindPlaybackProgress } from '../lib/playbackProgress';

const TABS = [
  { id: 'video', label: 'Video', icon: '▶' },
  { id: 'podcast', label: 'Podcast', icon: '♪' },
  { id: 'infographic', label: 'Infographic', icon: '◫' },
  { id: 'questionnaire', label: 'Questionnaire', icon: '?' },
];

export default function SubchapterPanel({ title, media, accent, hideTitle = false, itemKey }) {
  const [tab, setTab] = useState('video');
  const { trackWatchComplete } = useMediaProgress(itemKey);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || tab !== 'video') return;
    return bindPlaybackProgress(el, () => void trackWatchComplete('V'));
  }, [tab, media.video, trackWatchComplete]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || tab !== 'podcast') return;
    return bindPlaybackProgress(el, () => void trackWatchComplete('P'));
  }, [tab, media.podcast, trackWatchComplete]);

  return (
    <div className="subchapter-panel">
      {!hideTitle ? (
        <h3 className="subchapter-panel__title" style={{ borderColor: accent }}>
          {title}
        </h3>
      ) : null}
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
      <div className="media-view" role="tabpanel" onContextMenu={(event) => event.preventDefault()}>
        {tab === 'video' && (
          <video
            ref={videoRef}
            className="media-view__video"
            controls
            controlsList="nodownload"
            playsInline
            preload="metadata"
            src={media.video}
          >
            Your browser does not support video playback.
          </video>
        )}
        {tab === 'podcast' && (
          <div className="media-view__audio-wrap">
            <audio
              ref={audioRef}
              className="media-view__audio"
              controls
              controlsList="nodownload"
              preload="metadata"
              src={media.podcast}
            >
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
