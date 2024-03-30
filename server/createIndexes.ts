import Project from './models/projectModel.js';
import User from './models/userModel.js';

const createProjectIndex = async () => {
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

const createUserIndex = async () => {
  try {
    await User.collection.createIndex(
      {
        username: 'text',
        displayName: 'text',
      },
      { name: 'user_text_index', default_language: 'english' }
    );
    console.log('User text index created successfully.');
  } catch (error) {
    console.error('Error create text index:', error);
  }
};

export { createProjectIndex, createUserIndex };
