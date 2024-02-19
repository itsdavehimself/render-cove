import styles from './EditProfileSocialForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState } from 'react';
import SocialInput from '../SocialInput/SocialInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
  faGithub,
  faDiscord,
  faBehance,
} from '@fortawesome/free-brands-svg-icons';
import useUpdateUser from '../../../hooks/useUserUpdate';

const EditProfileSocialForm: React.FC = () => {
  const [facebookLink, setFacebookLink] = useState<string>('');
  const [instagramLink, setInstagramLink] = useState<string>('');
  const [xTwitterLink, setXTwitterLink] = useState<string>('');
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');
  const [discordLink, setDiscordLink] = useState<string>('');
  const [behanceLink, setBehanceLink] = useState<string>('');

  const facebookIcon: React.ReactNode = <FontAwesomeIcon icon={faFacebook} />;
  const instagramIcon: React.ReactNode = <FontAwesomeIcon icon={faInstagram} />;
  const xTwitterIcon: React.ReactNode = <FontAwesomeIcon icon={faXTwitter} />;
  const youtubeIcon: React.ReactNode = <FontAwesomeIcon icon={faYoutube} />;
  const githubIcon: React.ReactNode = <FontAwesomeIcon icon={faGithub} />;
  const discordIcon: React.ReactNode = <FontAwesomeIcon icon={faDiscord} />;
  const behanceIcon: React.ReactNode = <FontAwesomeIcon icon={faBehance} />;

  const { updateUser, isLoading, error } = useUpdateUser();

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('submitted');
  };

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Social</h2>
        <p className={styles['edit-profile-description']}>
          Drop a few links so people know where to find you
        </p>
      </header>
      <form
        className={styles['social-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <SocialInput
          htmlFor="facebook"
          label="Facebook"
          icon={facebookIcon}
          id="facebook"
          name="facebook"
          value={facebookLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setFacebookLink(e.target.value)}
        />
        <SocialInput
          htmlFor="instagram"
          label="Instagram"
          icon={instagramIcon}
          id="instagram"
          name="instagram"
          value={instagramLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setInstagramLink(e.target.value)}
        />
        <SocialInput
          htmlFor="xTwitter"
          label="X"
          icon={xTwitterIcon}
          id="xTwitter"
          name="xTwitter"
          value={xTwitterLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setXTwitterLink(e.target.value)}
        />
        <SocialInput
          htmlFor="youtube"
          label="YouTube"
          icon={youtubeIcon}
          id="youtube"
          name="youtube"
          value={youtubeLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
        <SocialInput
          htmlFor="github"
          label="Github"
          icon={githubIcon}
          id="github"
          name="github"
          value={githubLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setGithubLink(e.target.value)}
        />
        <SocialInput
          htmlFor="discord"
          label="Discord"
          icon={discordIcon}
          id="discord"
          name="discord"
          value={discordLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setDiscordLink(e.target.value)}
        />
        <SocialInput
          htmlFor="behance"
          label="Behance"
          icon={behanceIcon}
          id="behance"
          name="behance"
          value={behanceLink}
          placeholder="Username"
          clientError=""
          serverError=""
          onChange={(e) => setBehanceLink(e.target.value)}
        />
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={false} />
        </div>
      </form>
    </div>
  );
};

export default EditProfileSocialForm;
