import styles from './WorkflowInput.module.scss';
import { useCurrentEditor } from '@tiptap/react';

interface WorkflowInputProps {}

const WorkflowInput: React.FC<WorkflowInputProps> = () => {
  const { editor } = useCurrentEditor();

  return (
    <div className={styles['workflow-container']}>
      <pre>{editor && JSON.stringify(editor.getJSON(), null, 2)}</pre>
    </div>
  );
};

export default WorkflowInput;
