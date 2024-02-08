import { useState, ChangeEvent, FormEvent, KeyboardEvent, useRef } from 'react';

const ProjectForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const imageInput = useRef<HTMLInputElement | null>(null);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim() !== '') {
      const tagValue = e.currentTarget.value.replace(/,/g, '').trim();

      if (tagValue !== '') {
        setTags([...tags, tagValue]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addSoftware = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim() !== '') {
      const softwareItemValue = e.currentTarget.value.replace(/,/g, '').trim();

      if (softwareItemValue !== '') {
        setSoftwareList([...softwareList, softwareItemValue]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeSoftware = (indexToRemove: number) => {
    setSoftwareList(softwareList.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = event.target.files?.[0];

    if (selectedImage) {
      const previewURL = URL.createObjectURL(selectedImage);
      setImagePreview(previewURL);
    }
  };

  const handleSubmitProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('tags', JSON.stringify(tags));
    formData.append('softwareList', JSON.stringify(softwareList));

    const projectCreateResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/projects`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const projectJSON = await projectCreateResponse.json();

    if (!projectCreateResponse.ok) {
      setError(new Error(projectJSON.error));
    }
    if (projectCreateResponse.ok) {
      setError(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setSoftwareList([]);
      if (imageInput.current) {
        imageInput.current.value = '';
      }
    }
  };

  const preventEnterKeySubmission = (e: KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (e.key === 'Enter' && !['TEXTAREA', 'BUTTON'].includes(target.tagName)) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmitProject} onKeyDown={preventEnterKeySubmission}>
      <h3>Create a New Project</h3>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        onChange={handleTitleChange}
        value={title}
        required={true}
        id="title"
        name="title"
      ></input>
      <label htmlFor="description">Description:</label>
      <textarea
        onChange={handleDescriptionChange}
        value={description}
        id="description"
        name="description"
      ></textarea>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Image Preview"
          style={{ maxWidth: '25%' }}
        />
      )}
      <label htmlFor="image">Upload image:</label>
      <input
        type="file"
        name="image"
        id="image"
        required={true}
        onChange={handleFileChange}
        ref={imageInput}
      ></input>
      <div>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>
              <span>{tag}</span>
              <span onClick={() => removeTag(index)}> x</span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add tags"
          onKeyUp={(e) =>
            e.key === ',' || e.key === 'Enter' ? addTag(e) : null
          }
          id="tags"
        ></input>
      </div>
      <div>
        <ul>
          {softwareList.map((softwareItem, index) => (
            <li key={index}>
              <span>{softwareItem}</span>
              <span onClick={() => removeSoftware(index)}> x</span>
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add software"
          onKeyUp={(e) =>
            e.key === ',' || e.key === 'Enter' ? addSoftware(e) : null
          }
          id="software"
        ></input>
      </div>
      {error && <div>{error.message}</div>}
      <button>Create Project</button>
    </form>
  );
};

export default ProjectForm;
