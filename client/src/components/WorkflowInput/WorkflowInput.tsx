import styles from './WorkflowInput.module.scss';
import Tiptap from '../Tiptap/Tiptap.tsx';
import { useState } from 'react';

interface WorkflowInputProps {
  setWorkflowText: React.Dispatch<React.SetStateAction<object>>;
}

const WorkflowInput: React.FC<WorkflowInputProps> = ({ setWorkflowText }) => {
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);

  const handleContentUpdate = (content: object) => {
    setWorkflowText(content);
  };

  return (
    <div
      className={`${styles['workflow-container']} ${isEditorFocused ? styles['editor-focused'] : ''}`}
      onFocus={() => setIsEditorFocused(true)}
      onBlur={() => setIsEditorFocused(false)}
    >
      <Tiptap onUpdate={handleContentUpdate} />
    </div>
  );
};

export default WorkflowInput;
