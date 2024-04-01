import styles from './Search.module.scss';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Project from '../../types/Project';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImages,
  faUserGroup,
  faAngleUp,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import LargeLoadingSpinner from '../../components/LargeLoadingSpinner/LargeLoadingSpinner';
import UserCard from '../../components/UserCard/UserCard';

export type UserCardInfo = {
  displayName: string;
  username: string;
  avatarUrl: string;
  tagline: string;
  followers: string[];
  _id: string;
  projects: Project[];
};

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const [filter, setFilter] = useState(queryParams.get('filter') || 'projects');

  const projectsIcon: React.ReactNode = <FontAwesomeIcon icon={faImages} />;
  const usersIcon: React.ReactNode = <FontAwesomeIcon icon={faUserGroup} />;
  const downArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleDown} />;
  const upArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleUp} />;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(
    [],
  );
  const [userSearchResults, setUserSearchResults] = useState<UserCardInfo[]>(
    [],
  );
  const [sortOption, setSortOption] = useState<string>(
    queryParams.get('sort') || 'relevant',
  );
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [sortText, setSortText] = useState<string>('Most Relevant');
  const [error, setError] = useState<Error | null>(null);

  const handleSortOptionClick = (sort: string, text: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('sort', sort);
    navigate(`${location.pathname}?${newParams.toString()}`);
    setSortOption(sort);
    setSortText(text);
    setIsSortOpen(false);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      if (!query) return;

      const url = `${API_BASE_URL}/search?query=${query}&filter=${filter}&sort=${sortOption}`;

      const response = await fetch(url, {
        method: 'GET',
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      } else {
        if (filter === 'projects') {
          setProjectSearchResults(json);
        } else {
          setUserSearchResults(json);
          console.log(json);
        }
      }

      setIsLoading(false);
    };

    fetchSearchResults();
  }, [query, filter, sortOption]);

  const handleFilterClick = (newFilter: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('filter', newFilter);
    navigate(`${location.pathname}?${newParams.toString()}`);

    setFilter(newFilter);
    setIsSortOpen(false);
    setSortOption('relevant');
    setSortText('Most Relevant');
  };

  return (
    <main className={styles['search-page']}>
      <aside className={styles['filter-container']}>
        <h3>Filters & sorting</h3>
        <div className={styles.filters}>
          <h5 className={styles['sidebar-header']}>Filter by:</h5>
          <div className={styles['filter-buttons']}>
            <button
              className={`${styles['filter-button']} ${filter === 'projects' ? styles.selected : ''}`}
              onClick={() => handleFilterClick('projects')}
            >
              {projectsIcon} Projects
            </button>
            <button
              className={`${styles['filter-button']} ${filter === 'users' ? styles.selected : ''}`}
              onClick={() => handleFilterClick('users')}
            >
              {usersIcon} Users
            </button>
          </div>
        </div>
        <div className={styles.sort}>
          <h5 className={styles['sidebar-header']}>Sort by:</h5>
          <div className={styles['sort-dropdown-container']}>
            <div
              className={`${styles['sort-display']} ${isSortOpen ? styles.open : ''}`}
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <p className={styles['sort-selected']}>{sortText}</p>
              <p className={styles['dropdown-arrow']}>
                {isSortOpen ? upArrowIcon : downArrowIcon}
              </p>
            </div>
            {isSortOpen && (
              <ul className={styles['sort-options']}>
                {filter === 'projects' ? (
                  <>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'relevant' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('relevant', 'Most Relevant')
                      }
                    >
                      Most Relevant
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'liked' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('liked', 'Most Liked')
                      }
                    >
                      Most Liked
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'views' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('views', 'Most Viewed')
                      }
                    >
                      Most Viewed
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'recent' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('recent', 'Most Recent')
                      }
                    >
                      Latest
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'relevant' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('relevant', 'Most Relevant')
                      }
                    >
                      Most Relevant
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'projects' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('projects', 'Most Projects')
                      }
                    >
                      Most Projects
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'followers' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('followers', 'Most Followers')
                      }
                    >
                      Most Followers
                    </li>
                    <li
                      className={`${styles['sort-option']} ${sortOption === 'recent' ? styles.selected : ''}`}
                      onClick={() =>
                        handleSortOptionClick('recent', 'Most Recent')
                      }
                    >
                      Latest
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </aside>
      <div className={styles['results-container']}>
        <header className={styles['results-title']}>
          <h2>
            {filter === 'projects'
              ? projectSearchResults.length
              : userSearchResults.length}{' '}
            results for <span className={styles.query}>"{query}"</span>
          </h2>
        </header>
        {isLoading ? (
          <LargeLoadingSpinner />
        ) : (
          <>
            {filter === 'projects' ? (
              <>
                {projectSearchResults.length > 0 ? (
                  <>
                    <section className={styles['project-cards']}>
                      {projectSearchResults.map((project) => (
                        <ProjectCard
                          title={project?.title}
                          authorDisplayName={project?.author.displayName}
                          authorUsername={project?.author.username}
                          imageUrl={project?.images[0].url}
                          avatarUrl={project?.author.avatarUrl}
                          projectId={project?._id}
                          published={project?.published}
                          key={project?._id}
                        />
                      ))}
                    </section>
                  </>
                ) : (
                  <div className={styles['no-results']}>No results found.</div>
                )}
              </>
            ) : (
              <>
                {userSearchResults.length > 0 ? (
                  <>
                    {' '}
                    <section className={styles['user-cards']}>
                      {userSearchResults.map((user) => (
                        <UserCard userForCard={user} />
                      ))}
                    </section>
                  </>
                ) : (
                  <div className={styles['no-results']}>No results found.</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Search;
