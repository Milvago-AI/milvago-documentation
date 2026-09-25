import React from 'react';
import clsx from 'clsx';
import AdmonitionLayout from '@theme/Admonition/Layout';
import IconInfo from '@theme/Admonition/Icon/Info';
import AdmonitionTypesOriginal from '@theme-original/Admonition/Types';

function AdmonitionTypeEnterprise(props) {
  return (
    <AdmonitionLayout
      icon={<IconInfo />}
      title="Enterprise"
      {...props}
      type="enterprise"
      className={clsx('alert admonition-enterprise', props.className)}>
      {props.children}
    </AdmonitionLayout>
  );
}

export default {
  ...AdmonitionTypesOriginal,
  enterprise: AdmonitionTypeEnterprise,
};
