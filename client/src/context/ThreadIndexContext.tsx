import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface ThreadIndexContextType {
  threadIndex: number | undefined;
  setThreadIndex: Dispatch<SetStateAction<number | undefined>>;
}

const ThreadIndexContext = createContext<ThreadIndexContextType | undefined>(
  undefined,
);

const ThreadIndexProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [threadIndex, setThreadIndex] = useState<number | undefined>(undefined);

  return (
    <ThreadIndexContext.Provider value={{ threadIndex, setThreadIndex }}>
      {children}
    </ThreadIndexContext.Provider>
  );
};

export { ThreadIndexProvider, ThreadIndexContext };
