import './Tiptap.styles.scss';
import TiptapMenu from './TiptapMenu/TiptapMenu';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const lowlight = createLowlight(common);

const extensions = [
  StarterKit,
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

const content = '<p>Write about your workflow here...</p>';

const Tiptap = () => {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      slotBefore={<TiptapMenu />}
    >
      <FloatingMenu>This is the floating menu</FloatingMenu>
      <BubbleMenu>This is the bubble menu</BubbleMenu>
    </EditorProvider>
  );
};

export default Tiptap;
