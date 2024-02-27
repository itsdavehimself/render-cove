const addTag = (
  e: React.KeyboardEvent<HTMLInputElement>,
  setTagList: React.Dispatch<React.SetStateAction<string[]>>,
  tagList: string[],
  setInputWidth: React.Dispatch<React.SetStateAction<number>>,
): void => {
  const inputValue: string = e.currentTarget.value.trim();

  if (inputValue !== '') {
    const tagValue: string = e.currentTarget.value.replace(/,/g, '').trim();

    if (tagValue !== '') {
      setTagList([...tagList, tagValue]);
      e.currentTarget.value = '';
      setInputWidth(1);
    }
  }
};

const removeTag = (
  indexToRemove: number,
  setTagList: React.Dispatch<React.SetStateAction<string[]>>,
  tagList: string[],
): void => {
  setTagList(tagList.filter((_, index) => index !== indexToRemove));
};

const handleInputChange = (
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
  setInputWidth: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (inputRef.current) {
    setInputWidth(inputRef.current.value.length);
  }
};

const handleInputClick = (
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
): void => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
};

const preventEnterKeySubmission = (
  e: React.KeyboardEvent<HTMLFormElement>,
): void => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (e.key === 'Enter' && !['TEXTAREA', 'BUTTON'].includes(target.tagName)) {
    e.preventDefault();
  }
};

export {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
};
