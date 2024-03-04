import './Tiptap.styles.scss';
import TiptapMenu from './TiptapMenu/TiptapMenu';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const lowlight = createLowlight(common);

const extensions = [
  StarterKit,
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

interface TiptapProps {
  onUpdate: (content: object) => void;
  currentContent?: object;
}

const Tiptap: React.FC<TiptapProps> = ({ onUpdate, currentContent }) => {
  return (
    <EditorProvider
      extensions={extensions}
      content={
        currentContent
          ? currentContent
          : '<p>Write about your workflow here...</p>'
      }
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
