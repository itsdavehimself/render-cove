import React, { useRef } from 'react';
import styles from './PopOutMenu.module.scss';
import useClickOutside from '../../hooks/useClickOutside';

interface PopOutMenuProps {
  buttons: {
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }[];
  onClose: () => void;
}

const PopOutMenu: React.FC<PopOutMenuProps> = ({ buttons, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, onClose);

  return (
    <div className={styles['popout-menu']} ref={menuRef}>
      {buttons.map((button, index) => (
        <button
          type="button"
          className={styles['popout-button']}
          onClick={button.onClick}
          key={index}
        >
          <div className={styles['popout-button-icon']}>{button.icon}</div>
          <div>{button.label}</div>
        </button>
      ))}
    </div>
  );
};

export default PopOutMenu;
