import styles from './EditProfileSocialForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState, FormEvent } from 'react';
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
import { useAuthContext } from '../../../hooks/useAuthContext';
import { UserType, SocialEntry } from '../../../context/AuthContext';

const EditProfileSocialForm: React.FC = () => {
  const { updateUser, isLoading, error } = useUpdateUser();
  const { user } = useAuthContext();

  const findUsernameByNetwork = (user: UserType, network: string): string => {
    const socialEntry = user.socials.find(
      (entry: SocialEntry) => entry.network === network,
    ) as SocialEntry;
    return socialEntry?.username || '';
  };

  const [facebookLink, setFacebookLink] = useState<string>(
    findUsernameByNetwork(user, 'facebook'),
  );
  const [instagramLink, setInstagramLink] = useState<string>(
    findUsernameByNetwork(user, 'instagram'),
  );
  const [xLink, setXLink] = useState<string>(findUsernameByNetwork(user, 'x'));
  const [youtubeLink, setYoutubeLink] = useState<string>(
    findUsernameByNetwork(user, 'youtube'),
  );
  const [githubLink, setGithubLink] = useState<string>(
    findUsernameByNetwork(user, 'github'),
  );
  const [discordLink, setDiscordLink] = useState<string>(
    findUsernameByNetwork(user, 'discord'),
  );
  const [behanceLink, setBehanceLink] = useState<string>(
    findUsernameByNetwork(user, 'behance'),
  );

  const facebookIcon: React.ReactNode = <FontAwesomeIcon icon={faFacebook} />;
  const instagramIcon: React.ReactNode = <FontAwesomeIcon icon={faInstagram} />;
  const xIcon: React.ReactNode = <FontAwesomeIcon icon={faXTwitter} />;
  const youtubeIcon: React.ReactNode = <FontAwesomeIcon icon={faYoutube} />;
  const githubIcon: React.ReactNode = <FontAwesomeIcon icon={faGithub} />;
  const discordIcon: React.ReactNode = <FontAwesomeIcon icon={faDiscord} />;
  const behanceIcon: React.ReactNode = <FontAwesomeIcon icon={faBehance} />;

  const convertToSocialEntryArray = (formData: FormData): SocialEntry[] => {
    const socialsArray: SocialEntry[] = [];

    for (const [key, value] of formData.entries()) {
      const social = { network: key, username: value.toString() };
      console.log(social);
      socialsArray.push(social);
    }

    return socialsArray;
  };

  const handleFormSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const socialsArray = convertToSocialEntryArray(formData);

    const socialsFormData = new FormData();
    socialsArray.forEach((social, index) => {
      socialsFormData.append(`socials[${index}][network]`, social.network);
      socialsFormData.append(`socials[${index}][username]`, social.username);
    });

    await updateUser(socialsFormData);
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
          initialValue={facebookLink}
          placeholder="Username"
          onChange={(e) => setFacebookLink(e.target.value)}
        />
        <SocialInput
          htmlFor="instagram"
          label="Instagram"
          icon={instagramIcon}
          id="instagram"
          name="instagram"
          initialValue={instagramLink}
          placeholder="Username"
          onChange={(e) => setInstagramLink(e.target.value)}
        />
        <SocialInput
          htmlFor="x"
          label="X"
          icon={xIcon}
          id="x"
          name="x"
          initialValue={xLink}
          placeholder="Username"
          onChange={(e) => setXLink(e.target.value)}
        />
        <SocialInput
          htmlFor="youtube"
          label="YouTube"
          icon={youtubeIcon}
          id="youtube"
          name="youtube"
          initialValue={youtubeLink}
          placeholder="Username"
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
        <SocialInput
          htmlFor="github"
          label="Github"
          icon={githubIcon}
          id="github"
          name="github"
          initialValue={githubLink}
          placeholder="Username"
          onChange={(e) => setGithubLink(e.target.value)}
        />
        <SocialInput
          htmlFor="discord"
          label="Discord"
          icon={discordIcon}
          id="discord"
          name="discord"
          initialValue={discordLink}
          placeholder="Username"
          onChange={(e) => setDiscordLink(e.target.value)}
        />
        <SocialInput
          htmlFor="behance"
          label="Behance"
          icon={behanceIcon}
          id="behance"
          name="behance"
          initialValue={behanceLink}
          placeholder="Username"
          onChange={(e) => setBehanceLink(e.target.value)}
        />
        {error && <div>{error.toString()}</div>}
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default EditProfileSocialForm;
