import { format, parseISO } from 'date-fns';

const formatDate = (date: Date): string => {
  const isoDateString = date.toString();
  const dateObject = parseISO(isoDateString);
  const formattedDate = format(dateObject, 'MMMM dd, yyyy');

  return formattedDate;
};

export { formatDate };
