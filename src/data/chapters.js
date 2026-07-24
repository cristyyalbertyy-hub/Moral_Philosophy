export const courseTitle = 'Moral Philosophy';

const assetBase = import.meta.env.VITE_MEDIA_ORIGIN || import.meta.env.BASE_URL;

export const overviewImage = `${assetBase}MPA.png`;

export const chapters = [
  {
    id: 'TF',
    title: 'Theoretical Foundations',
    color: '#14213d',
    accent: '#2ec4b6',
    subchapters: [
      { id: 'MS', title: 'Moral Systems' },
      { id: 'PA', title: 'Philosophical Anthropology' },
      { id: 'SER', title: 'Science and Ethics Relationship' },
    ],
  },
  {
    id: 'CE',
    title: 'Clinical Ethics',
    color: '#1b4332',
    accent: '#95d5b2',
    subchapters: [
      { id: 'PPR', title: 'Patient–Physician Relationship' },
      { id: 'NM', title: 'Narrative Medicine' },
      { id: 'E', title: 'Empathy' },
      { id: 'EC', title: 'Ethical Committees' },
    ],
  },
  {
    id: 'GC',
    title: 'Global Context',
    color: '#e85d04',
    accent: '#ffba08',
    subchapters: [
      { id: 'SDG', title: 'Sustainable Development Goals 2030', fileId: 'SDG', altFileId: 'SGD' },
      { id: 'HD', title: 'Health Diplomacy' },
      { id: 'HRH', title: 'Human Rights and Health' },
      { id: 'TM', title: 'Transcultural Medicine' },
    ],
  },
];

export function mediaBase(chapterId, sub) {
  const fileId = sub.fileId ?? sub.id;
  return `${chapterId}_${fileId}`;
}

export function mediaPaths(chapterId, sub) {
  const base = mediaBase(chapterId, sub);
  const alt = sub.altFileId ? `${chapterId}_${sub.altFileId}` : null;
  const mediaOrigin = import.meta.env.VITE_MEDIA_ORIGIN || import.meta.env.BASE_URL;

  return {
    video: alt ? `${mediaOrigin}${alt}_V.mp4` : `${mediaOrigin}${base}_V.mp4`,
    podcast: alt ? `${mediaOrigin}${alt}_P.m4a` : `${mediaOrigin}${base}_P.m4a`,
    infographic: `${mediaOrigin}${base}_I.png`,
    questionnaire: `${mediaOrigin}${base}_Q.csv`,
  };
}
