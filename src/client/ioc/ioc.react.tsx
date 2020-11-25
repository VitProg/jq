import React, { useContext } from 'react';
import { Container } from '@owja/ioc';

const IocContext = React.createContext<{ container: Container | null }>({ container: null });

type Props = {
  container: Container;
};

export const IocProvider: React.FC<Props> = (props) => {
  return (
    <IocContext.Provider value={{ container: props.container }}>
      {props.children}
    </IocContext.Provider>
  )
}

export function useInjection<T>(identifier: symbol) {
  const { container } = useContext(IocContext);
  if (!container) { throw new Error(); }
  return container.get<T>(identifier);
}
