import styles from './ToggleSwitch.module.scss';
import { useState, useEffect } from 'react';

interface ToggleSwitchProps {
  setSectionCheckedBoxes: React.Dispatch<React.SetStateAction<string[]>>;
  sectionCheckedBoxes: string[];
  boxesIdArray: string[];
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  sectionCheckedBoxes,
  setSectionCheckedBoxes,
  boxesIdArray,
}) => {
  const [isToggledOn, setIsToggledOn] = useState(
    sectionCheckedBoxes.length > 0,
  );

  useEffect(() => {
    if (sectionCheckedBoxes.length > 0) {
      setIsToggledOn(true);
    } else {
      setIsToggledOn(false);
    }
  }, [sectionCheckedBoxes]);

  const handleSwitchClick = () => {
    setSectionCheckedBoxes((prevCheckedBoxes) => {
      if (!isToggledOn) {
        return [...prevCheckedBoxes, ...boxesIdArray];
      } else {
        return prevCheckedBoxes.filter(
          (checkbox) => !boxesIdArray.includes(checkbox),
        );
      }
    });

    setIsToggledOn(!isToggledOn);
  };

  return (
    <div
      onClick={handleSwitchClick}
      className={`${styles['switch-container']} ${isToggledOn ? styles['toggled-on'] : styles['toggled-off']}`}
    >
      <div
        className={`${styles['switch']} ${isToggledOn ? styles['toggled-on'] : styles['toggled-off']}`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
