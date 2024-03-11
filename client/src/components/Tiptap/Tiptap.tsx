import './Tiptap.styles.scss';
import TiptapMenu from './TiptapMenu/TiptapMenu';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorProvider, generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';

const lowlight = createLowlight(common);

const extensions = [
  StarterKit,
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

interface TiptapProps {
  onUpdate: (content: object) => void;
  currentContent?: object | null;
}

const Tiptap: React.FC<TiptapProps> = ({ onUpdate, currentContent }) => {
  const editorContent = useMemo(() => {
    if (currentContent) {
      return generateHTML(currentContent, [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Strike,
        Heading,
        ListItem,
        BulletList,
        OrderedList,
        CodeBlockLowlight,
      ]);
    } else {
      return '<p>Write about your workflow here...</p>';
    }
  }, [currentContent]);

  return (
    <EditorProvider
      key={currentContent ? 'editor_with_content' : 'editor_without_content'}
      extensions={extensions}
      content={editorContent}
      onUpdate={({ editor }) => {
        onUpdate(editor.getJSON());
      }}
      slotBefore={<TiptapMenu />}
    >
      <span></span>
    </EditorProvider>
  );
};

export default Tiptap;
