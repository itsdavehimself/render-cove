import styles from './TagDisplay.module.scss';

interface TagDisplayProps {
  header: string;
  tagList: string[] | undefined;
}

const TagDisplay: React.FC<TagDisplayProps> = ({ header, tagList }) => {
  return (
    <div className={styles['tag-container']}>
      <h4 className={styles['tag-header']}>{header}</h4>
      <div className={styles.tags}>
        {tagList?.map(
          (tag, index) =>
            tag !== '' && (
              <div key={index} className={styles.tag}>
                {tag}
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default TagDisplay;
