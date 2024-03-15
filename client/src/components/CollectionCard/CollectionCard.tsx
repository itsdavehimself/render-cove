import styles from './CollectionCard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEyeSlash,
  faEllipsisVertical,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import PopOutMenu from '../PopOutMenu/PopOutMenu';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

interface CollectionCardProps {
  title: string;
  creator: string;
  collectionId: string;
  isPrivate: boolean;
  imageUrl: string;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCollectionToDelete: React.Dispatch<React.SetStateAction<string>>;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  creator,
  collectionId,
  isPrivate,
  imageUrl,
  setIsDeleteModalOpen,
  setIsEditModalOpen,
  setCollectionToDelete,
}) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const privateIcon: React.ReactNode = <FontAwesomeIcon icon={faEyeSlash} />;
  const ellipsisIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faEllipsisVertical} />
  );
  const editIcon: React.ReactNode = <FontAwesomeIcon icon={faPenToSquare} />;
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;

  const handleCollectionClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    navigate(`/collections/${collectionId}`);
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenDeleteModal = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
    setCollectionToDelete(collectionId);
  };

  const handleOpenEditModal = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };
  return (
    <div
      className={styles['collection-card']}
      onClick={(e) => handleCollectionClick(e)}
    >
      {isMenuOpen && (
        <div className={styles['popout-menu-container']}>
          <PopOutMenu
            buttons={[
              {
                icon: editIcon,
                label: 'Edit collection',
                onClick: handleOpenEditModal,
              },
              {
                icon: deleteIcon,
                label: 'Delete collection',
                onClick: handleOpenDeleteModal,
              },
            ]}
          />
        </div>
      )}
      <div className={styles['card-options']}>
        <div>
          {isPrivate && (
            <div className={styles['private']}>{privateIcon} Private</div>
          )}
        </div>
        {user.userId === creator && (
          <>
            <button
              className={styles['options-button']}
              onClick={(e) => handleOptionClick(e)}
            >
              {ellipsisIcon}
            </button>
          </>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles['collection-info']}>
          <h4 className={styles.title}>{title}</h4>
        </div>
      </div>
      <div className={styles['card-overlay']}></div>
      <img className={styles['project-image']} src={imageUrl}></img>
    </div>
  );
};

export default CollectionCard;
