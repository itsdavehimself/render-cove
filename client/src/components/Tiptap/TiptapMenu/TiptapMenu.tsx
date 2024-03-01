import styles from './TiptapMenu.module.scss';
import { useCurrentEditor } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faItalic,
  faStrikethrough,
  faCode,
  faListOl,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import RemoveStyleSVG from '../../SVGComponents/RemoveStyleSVG';
import CodeBlockSVG from '../../SVGComponents/CodeBlockSVG';
import RemoveListSVG from '../../SVGComponents/RemoveListSVG';

const TiptapMenu = () => {
  const { editor } = useCurrentEditor();

  const italicIcon: React.ReactNode = <FontAwesomeIcon icon={faItalic} />;
  const strikethroughIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faStrikethrough} />
  );
  const codeIcon: React.ReactNode = <FontAwesomeIcon icon={faCode} />;
  const olIcon: React.ReactNode = <FontAwesomeIcon icon={faListOl} />;
  const ulIcon: React.ReactNode = <FontAwesomeIcon icon={faListUl} />;

  if (!editor) {
    return null;
  }

  return (
    <div className={styles['tiptap-menu']}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? `${styles['is-active']}` : ''}
      >
        <span className={styles['bold-icon']}>B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? `${styles['is-active']}` : ''}
      >
        {italicIcon}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? `${styles['is-active']}` : ''}
      >
        {strikethroughIcon}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? `${styles['is-active']}` : ''}
      >
        {codeIcon}
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <RemoveStyleSVG />
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        <RemoveListSVG />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? `${styles['is-active']}`
            : ''
        }
      >
        <span className={styles['format-icon']}>
          H<sub>1</sub>
        </span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? `${styles['is-active']}`
            : ''
        }
      >
        <span className={styles['format-icon']}>
          H<sub>2</sub>
        </span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 })
            ? `${styles['is-active']}`
            : ''
        }
      >
        <span className={styles['format-icon']}>
          H<sub>3</sub>
        </span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive('bulletList') ? `${styles['is-active']}` : ''
        }
      >
        {ulIcon}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive('orderedList') ? `${styles['is-active']}` : ''
        }
      >
        {olIcon}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? `${styles['is-active']}` : ''}
      >
        <CodeBlockSVG />
      </button>
    </div>
  );
};

export default TiptapMenu;
