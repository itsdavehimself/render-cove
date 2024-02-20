import { AlertInfo } from '../../containers/EditProfile/EditProfile';

const handleAlert = (
  isSuccess: boolean,
  alertInfo: AlertInfo,
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>,
): void => {
  setAlertInfo({ isSuccess, isShowing: true });

  setTimeout(() => {
    setAlertInfo({ ...alertInfo, isShowing: false });
  }, 4000);
};

export { handleAlert };
