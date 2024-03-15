import Collection from './Collection';

export const GET_COLLECTIONS = 'GET_COLLECTIONS';

interface GetCollectionsAction {
  type: typeof GET_COLLECTIONS;
  payload: Collection[];
}

export type CollectionsAction = GetCollectionsAction;
