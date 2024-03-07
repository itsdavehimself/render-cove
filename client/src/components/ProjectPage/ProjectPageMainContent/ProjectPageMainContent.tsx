import styles from './ProjectPageMainContent.module.scss';
import Project from '../../../types/Project';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faShare,
  faBookmark,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { generateHTML } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { Content } from '@tiptap/react';
import { GenerationData } from '../../../types/Project';

interface ProjectPageMainContentProps {
  projectInfo: Project | undefined;
  generationData: GenerationData;
  setGenerationData: React.Dispatch<React.SetStateAction<GenerationData>>;
}

const ProjectPageMainContent: React.FC<ProjectPageMainContentProps> = ({
  projectInfo,
  generationData,
  setGenerationData,
}) => {
  const lowlight = createLowlight(common);
  const likeIcon: React.ReactNode = <FontAwesomeIcon icon={faThumbsUp} />;
  const bookmarkIcon: React.ReactNode = <FontAwesomeIcon icon={faBookmark} />;
  const shareIcon: React.ReactNode = <FontAwesomeIcon icon={faShare} />;
  const infoIcon: React.ReactNode = <FontAwesomeIcon icon={faInfoCircle} />;
  const [editorContent, setEditorContent] = useState<Content | undefined>(
    undefined,
  );
  const [editorInitialized, setEditorInitialized] = useState(false);

  useEffect(() => {
    const htmlContent =
      projectInfo &&
      generateHTML(projectInfo.workflow, [
        Document,
        Paragraph,
        Text,
        Bold,
        Heading,
        ListItem,
        BulletList,
        OrderedList,
        CodeBlockLowlight,
      ]);

    setEditorContent(htmlContent);
  }, [projectInfo]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: editorContent,
    editable: false,
    onUpdate: ({ editor }) => {
      if (!editorInitialized) {
        editor.commands.setContent(editorContent as Content);
        setEditorInitialized(true);
      }
    },
  });

  useEffect(() => {
    if (editor && editorContent) {
      editor.commands.setContent(editorContent);
    }
  }, [editorContent, editor]);

  return (
    <main className={styles['main-container']}>
      <div className={styles['button-container']}>
        <button className={styles['social-button']}>{likeIcon}</button>
        <button className={styles['social-button']}>{bookmarkIcon}</button>
        <button className={styles['social-button']}>{shareIcon}</button>
      </div>
      {projectInfo && (
        <section className={styles.project}>
          {projectInfo.images.map((image) => (
            <div className={styles['image-container']}>
              <div className={styles.image} key={image.fileName}>
                <button
                  className={styles['generation-button']}
                  onClick={() =>
                    setGenerationData({
                      ...generationData,
                      prompt: image.prompt,
                      negativePrompt: image.negativePrompt,
                      model: image.model,
                      seed: image.seed,
                      cfgScale: image.cfgScale,
                      steps: image.steps,
                    })
                  }
                >
                  <span>{infoIcon}</span> Generation Data
                </button>
                <img src={image.url}></img>
              </div>
              <div className={styles['caption-container']}>
                <p className={styles.caption}>{image.caption}</p>
              </div>
            </div>
          ))}
          <section className={styles.workflow}>
            <EditorContent editor={editor} />
            {projectInfo.workflowUrl && (
              <img src={projectInfo.workflowUrl}></img>
            )}
          </section>
        </section>
      )}
    </main>
  );
};

export default ProjectPageMainContent;
