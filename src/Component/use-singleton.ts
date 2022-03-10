import { useEffect } from 'react';

const singletons: { [name: string]: boolean } = {};

export function useSingleton(name: string) {
  useEffect(() => {
    if (singletons[name]) {
      throw new Error(
        `Singletons can only be rendered once (rendering "${name}").`
      );
    }

    singletons[name] = true;

    return () => {
      singletons[name] = false;
    };
  }, [name]);
}
