import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.scss';

const SearchBar: React.FC = () => {
  const [isHoveringSearch, setIsHoveringSearch] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const searchIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faMagnifyingGlass} />
  );

  const hoverOverSearch = (): void => {
    setIsHoveringSearch(true);
  };

  const exitSearchHover = (): void => {
    setIsHoveringSearch(false);
  };

  const focusSearch = (): void => {
    console.log('hi');
    setIsSearchFocused(true);
  };

  const blurSearch = (): void => {
    console.log('bye');
    setIsSearchFocused(false);
  };

  return (
    <form
      className={`${styles['search-bar']} ${isHoveringSearch ? styles.hovering : ''} ${isSearchFocused ? styles.focused : ''}`}
      onMouseEnter={hoverOverSearch}
      onMouseLeave={exitSearchHover}
    >
      <div className={styles['search-icon']}>{searchIcon}</div>
      <input
        type="search"
        placeholder="Search RenderCove"
        onFocus={focusSearch}
        onBlur={blurSearch}
      ></input>
    </form>
  );
};

export default SearchBar;
