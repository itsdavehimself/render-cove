import styles from './PopOutMenu.module.scss';

interface PopOutMenuProps {
  buttons: {
    icon: React.ReactNode;
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }[];
}

const PopOutMenu: React.FC<PopOutMenuProps> = ({ buttons }) => {
  return (
    <div className={styles['popout-menu']}>
      {buttons.map((button, index) => (
        <button
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
