import styles from './ShareModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faLink } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faReddit } from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'react-router-dom';
import Project from '../../types/Project';
import { useState } from 'react';

interface ShareModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
}

const ShareModal: React.FC<ShareModalProps> = ({ setIsOpen, project }) => {
  const { projectId } = useParams();
  const closeIcon: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const linkIcon: React.ReactNode = <FontAwesomeIcon icon={faLink} />;
  const xIcon: React.ReactNode = <FontAwesomeIcon icon={faXTwitter} />;
  const redditIcon: React.ReactNode = <FontAwesomeIcon icon={faReddit} />;
  const [copyText, setCopyText] = useState<string>('Copy link');

  const copyCurrentUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyText('Link copied');
        setTimeout(() => {
          setCopyText('Copy link');
        }, 5000);
      })
      .catch((error) => {
        setCopyText(error.message);
      });
  };

  return (
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['share-modal']}>
          <div className={styles.header}>
            <h3>Share project</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={styles['close-button']}
            >
              {closeIcon}
            </button>
          </div>
          <div className={styles['share-buttons']}>
            <div className={styles['button-container']}>
              <button
                onClick={copyCurrentUrlToClipboard}
                className={styles['share-button']}
              >
                {linkIcon}
              </button>
              <p>{copyText}</p>
            </div>
            <div className={styles['button-container']}>
              <a
                href={`https://www.reddit.com/submit?url=http://www.rendercove.com/project/${projectId}&title=${project.title}`}
                target="_blank"
                className={`${styles['share-button']} ${styles.reddit}`}
              >
                {redditIcon}
              </a>
              <p>Reddit</p>
            </div>
            <div className={styles['button-container']}>
              <a
                href={`https://x.com/intent/tweet?text=Check%20out%20this%20project%20on%20RenderCove%3A%20http%3A%2F%2Fwww.rendercove.com%2Fproject%2F${projectId}`}
                target="_blank"
                className={`${styles['share-button']} ${styles.x}`}
              >
                {xIcon}
              </a>
              <p>X</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
