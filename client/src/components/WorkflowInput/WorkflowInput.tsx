import styles from './WorkflowInput.module.scss';
import Tiptap from '../Tiptap/Tiptap.tsx';
import { useState } from 'react';

interface WorkflowInputProps {
  setWorkflowText: React.Dispatch<React.SetStateAction<object>>;
  serverError?: string;
}

const WorkflowInput: React.FC<WorkflowInputProps> = ({
  setWorkflowText,
  serverError,
}) => {
  const [isEditorFocused, setIsEditorFocused] = useState<boolean>(false);

  const handleContentUpdate = (content: object) => {
    setWorkflowText(content);
  };

  return (
    <>
      <div
        className={`${styles['workflow-container']} ${isEditorFocused ? styles['editor-focused'] : ''} ${serverError ? styles.error : ''} `}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
      >
        <Tiptap onUpdate={handleContentUpdate} />
      </div>
      {serverError && (
        <div className={styles['input-error-message']}>{serverError}</div>
      )}
    </>
  );
};

export default WorkflowInput;
