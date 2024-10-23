import React, {PropsWithChildren} from 'react';

type BuildProvidersTreeProps =
  | React.FC<PropsWithChildren<any>>
  | [React.FC<PropsWithChildren<any>>, Record<string, any>];

export const buildProvidersTree = (
  componentsWithProps: BuildProvidersTreeProps[],
) => {
  const initialComponent: React.FC<PropsWithChildren> = ({children}) => (
    <>{children}</>
  );

  return componentsWithProps.reduce((AccumulatedComponents, Provider) => {
    return ({children}) => {
      const [Component, props = {}] = Array.isArray(Provider)
        ? Provider
        : [Provider];

      return (
        <AccumulatedComponents>
          <Component {...props}>{children}</Component>
        </AccumulatedComponents>
      );
    };
  }, initialComponent);
};
