import { CollectionsAction } from '../types/CollectionsActionTypes';
import Collection from '../types/Collection';

interface CollectionsState {
  collections: Collection[];
}

export const collectionsReducer = (
  state: CollectionsState,
  action: CollectionsAction,
): CollectionsState => {
  switch (action.type) {
    case 'GET_COLLECTIONS':
      return { collections: action.payload };
    default:
      return state;
  }
};
