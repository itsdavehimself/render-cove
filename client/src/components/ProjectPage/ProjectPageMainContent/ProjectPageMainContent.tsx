import styles from './ProjectPageMainContent.module.scss';
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
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
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
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useProjectContext } from '../../../hooks/useProjectContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface ProjectPageMainContentProps {
  generationData: GenerationData;
  setGenerationData: React.Dispatch<React.SetStateAction<GenerationData>>;
}

const ProjectPageMainContent: React.FC<ProjectPageMainContentProps> = ({
  generationData,
  setGenerationData,
}) => {
  const { user } = useAuthContext();
  const { project, dispatchProject } = useProjectContext();
  const lowlight = createLowlight(common);
  const likeIcon: React.ReactNode = <FontAwesomeIcon icon={faThumbsUp} />;
  const bookmarkIcon: React.ReactNode = <FontAwesomeIcon icon={faBookmark} />;
  const shareIcon: React.ReactNode = <FontAwesomeIcon icon={faShare} />;
  const infoIcon: React.ReactNode = <FontAwesomeIcon icon={faInfoCircle} />;
  const [editorContent, setEditorContent] = useState<Content | undefined>(
    undefined,
  );
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const htmlContent =
      project &&
      generateHTML(project.workflow, [
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

    setEditorContent(htmlContent);
  }, [project]);

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

  const handleLikeClick = async (): Promise<void> => {
    try {
      const likeResponse = await fetch(
        `${API_BASE_URL}/projects/like/${project?._id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!likeResponse.ok) {
        throw new Error(
          `Failed to like the project. Status: ${likeResponse.status}`,
        );
      }

      const responseData = await likeResponse.json();
      dispatchProject({
        type: 'UPDATE_PROJECT',
        payload: { project: responseData.project },
      });
      setIsLiked(project.likes.some((like) => like.userId === user.userId));
    } catch (error) {
      console.error('Error liking the project:', error);
    }
  };

  useEffect(() => {
    if (project && user) {
      setIsLiked(project.likes.some((like) => like.userId === user.userId));
    }
  }, [user, project]);

  return (
    <main className={styles['main-container']}>
      <div className={styles['button-container']}>
        <button
          className={`${styles['social-button']} ${isLiked ? styles.liked : ''}`}
          onClick={handleLikeClick}
        >
          {likeIcon}
        </button>
        <button className={styles['social-button']}>{bookmarkIcon}</button>
        <button className={styles['social-button']}>{shareIcon}</button>
      </div>
      {project && (
        <section className={styles.project}>
          {project?.images.map((image, index) => (
            <div className={styles['image-container']} key={index}>
              <div className={styles.image}>
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
                      sampler: image.sampler,
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
            {project?.workflowImage.url && (
              <img src={project.workflowImage.url}></img>
            )}
          </section>
        </section>
      )}
    </main>
  );
};

export default ProjectPageMainContent;
