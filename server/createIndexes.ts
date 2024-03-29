import Project from './models/projectModel.js';

const createIndexes = async () => {
  try {
    await Project.collection.createIndex(
      {
        title: 'text',
        description: 'text',
        tags: 'text',
      },
      {
        name: 'project_text_index',
        default_language: 'english',
      }
    );
    console.log('Project text index created successfully.');
  } catch (error) {
    console.error('Error creating text index:', error);
  }
};

export default createIndexes;
