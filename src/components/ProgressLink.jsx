import { STUDENT_PROGRESS_URL } from '../config/urls';

export default function ProgressLink({ className = '', compact = false }) {
  return (
    <a
      className={`progress-link${className ? ` ${className}` : ''}`}
      href={STUDENT_PROGRESS_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {compact ? 'Progress →' : 'My progress →'}
    </a>
  );
}
