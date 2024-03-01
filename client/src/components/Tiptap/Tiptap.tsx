import './Tiptap.styles.scss';
import TiptapMenu from './TiptapMenu/TiptapMenu';

import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const extensions = [StarterKit];

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
