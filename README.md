# RenderCove

## Project Description

RenderCove is a full-stack social web application designed for AI artists to showcase their artworks and creative processes. Crafted with the artist in mind, RenderCove offers a specialized platform for AI art enthusiasts and hobbyists to share their creations, techniques, and insights into their use of AI tools and processes.

### Key Features:

- **Create and Share Projects:** Easily upload and share your AI art projects, showcasing your creativity to the community.

- **Customize Your Profile:** Personalize your profile to reflect your unique style and interests, making it easier for others to connect with you.

- **Follow and Like Artists and Their Works:** Stay updated on your favorite artists and artworks by following and liking them, fostering a supportive community environment.

- **Real-Time Notifications & Messaging:** Receive instant notifications and engage in real-time conversations with other artists, enhancing collaboration and networking opportunities.

- **Automatically Capture & Share EXIF Data:** Seamlessly capture and share metadata associated with your artworks, providing valuable insights into your creative process.

- **WYSIWYG Workflow Text Editor:** Utilize a user-friendly text editor to document your artistic workflow, allowing you to share detailed insights and techniques with ease.

- **Google OAuth Authentication:** Seamlessly login using your Google account. This feature streamlines the login process, providing users with a quick and secure method to access the platform.

- **Indexing and Search Feature:** Effortlessly explore and discover a vast array of AI art projects, profiles, and artworks with our robust indexing and search functionality. Quickly locate specific content, artists, or topics of interest, empowering you to delve deeper into the creative community and find inspiration at your fingertips.

- **Responsive Design:** Enjoy a seamless browsing experience across devices, ensuring accessibility and usability for all users.

RenderCove is tailored for AI artists, offering a seamless platform to share their creative works and insights conveniently. Inspired by the collaborative spirit of the r/stablediffusion subreddit, where artists shared their work alongside detailed process descriptions, RenderCove aims to provide a dedicated space for artists to showcase their creations. Rooted in the ethos of fostering a community of serious hobbyists, the project encourages documenting creative processes and approaching art with a scientific mindset.

## Table of Contents

- [Project Title](#rendercove)
- [Project Description](#project-description)
- [Table of Contents](#table-of-contents)
- [Live Demo](#demo)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Features](#features)
- [Contact](#contact)

## Demo

If you'd like to explore the app, you can do so by visiting https://rendercove.netlify.app

Feel free to create your own account by using an email and password,
or you can use the sample account credentials:

**email:** sample1@email.com
**password:** Password123!

## Screenshots

### Home Page

<img src="./client/src/assets/screenshots/home-page-desktop.png" alt="Home Page" width="750" />

### Explore Page

<img src="./client/src/assets/screenshots/explore-page-desktop.png" alt="Explore Page" width="750" />

### Edit Profile

<img src="./client/src/assets/screenshots/edit-profile-desktop.png" alt="Edit Profile" width="750" />

### User Profile

<img src="./client/src/assets/screenshots/user-profile-desktop.png" alt="User Profile" width="750" />

### Project Page

<img src="./client/src/assets/screenshots/project-page-desktop.png" alt="Project Page" width="750" />

### Project Upload Page

<img src="./client/src/assets/screenshots/project-upload-desktop.png" alt="Project Upload Page" width="750">

### Search Results Page

<img src="./client/src/assets/screenshots/search-desktop.png" alt="Project Upload Page" width="750">

### Responsive Design

<img src="./client/src/assets/screenshots/rendercove-responsive-design.gif" alt="Responsive Design"/>

## Installation

### Preqrequisites

- Ensure you have Node.js and npm installed on your machine.
- You need a MongoDB Atlas account for database connectivity.
- You will also need to create a free Amazon AWS S3 bucket.

### Cloning the repository

1. Clone the repository: `git clone https://github.com/itsdavehimself/render-cove.git`

2. Navigate to the project directory: `cd render-cove`

### Server Setup

3. Navigate to the server directory and install dependencies: `cd server && npm install`

4. Create a .env file `touch .env`

5. Inside the .env file, create a port variable: `PORT=4000`

6. Next create a URI variable for the MongoDB database: `URI='mongodb+srv://your_username:your_password@cluster0.gnnj1tx.mongodb.net/your_database?retryWrites=true&w=majority&appName=AtlasApp'`

Be sure to replace 'your_username', 'your_password', and 'your_database' with your actual MongoDB credentials.

7. Create a SECRET variable used for authenticating logins. It can be any random string of letters, numbers, and symbols, for example: `JWT_SECRET='#9XhZ@oD5TjLbN*wR$Gy8p2z!Q6AqFs7UvHc1rKmV'`

8. Lastly, for S3 Bucket connectivity, create a variables for `BUCKET_NAME`, `BUCKET_REGION`, `ACCESS_KEY`, `SECRET_ACCESS_KEY` all of which are provided by Amazon during the bucket creation.

9. Navigate back to the parent directory `cd ..`

### Client Setup

9. Navigate to the client directory and install dependencies: `cd client && npm install`

10. Again, create another .env file `touch .env`

11. Inside the .env file, create an API url variable: `VITE_API_BASE_URL=http://localhost:4000/api`

12. After the API url variable, create a variable for the socket connection: `VITE_SOCKET_URL=ws://localhost:4000`

### Starting the App

12. While inside the client directory, you can start the client by running the following code: `npm run dev`

13. In a new terminal, navigate to the server folder `cd server`

14. Start the server `npm run dev`

## Usage

1. Open your browser and navigate to `http://localhost:5173`

2. You will need to create an account to login if you are running the app locally.

3. When logged in, you will be taken to the dashboard where you can explore the different features. Feel free to explore the pre-loaded content on the app. If you are an artist, you can also explore the project upload process. Get involved by creating collections, liking & commenting on other users posts, and following artists you like.

## Technologies

### Frontend

- React.js
- SCSS Modules
- Vite

### Backend

- Express.js
- Node.js
- Web Sockets
- Multer

### Database

- MongoDB
- Amazon S3 Bucket

### Development Tools

- npm
- Git
- GitHub
- Visual Studio Code
- ESLint
- Prettier
- Socket.IO

## Additional Features

- User authentication with JWT
- CRUD operations for managing user data
- Salting and hashing for encryption of password data
- Validation and sanitation of user input
- Front-end compression of images before uploading
- Commenting on user posts

## Contact

Email: davidsmolen@gmail.com
