import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './SearchBar.module.scss';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [isHoveringSearch, setIsHoveringSearch] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigate = useNavigate();

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
    setIsSearchFocused(true);
  };

  const blurSearch = (): void => {
    setIsSearchFocused(false);
  };

  const handleSubmitSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();
    navigate(`/search?query=${searchQuery}&filter=projects&sort=relevant`);
  };

  const handleInput = (search: string) => {
    setSearchQuery(search);
  };

  return (
    <form
      onSubmit={handleSubmitSearch}
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
        onChange={(e) => handleInput(e.target.value)}
      ></input>
    </form>
  );
};

export default SearchBar;
