import styles from './WorkflowInput.module.scss';
import { useCurrentEditor } from '@tiptap/react';
import Tiptap from '../Tiptap/Tiptap.tsx';
import { useState } from 'react';

interface WorkflowInputProps {}

const WorkflowInput: React.FC<WorkflowInputProps> = () => {
  const { editor } = useCurrentEditor();
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);

  return (
    <div
      className={`${styles['workflow-container']} ${isEditorFocused ? styles['editor-focused'] : ''}`}
      onFocus={() => setIsEditorFocused(true)}
      onBlur={() => setIsEditorFocused(false)}
    >
      <Tiptap />
      <pre>{editor && JSON.stringify(editor.getJSON(), null, 2)}</pre>
    </div>
  );
};

export default WorkflowInput;
