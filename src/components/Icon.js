// @flow

import React from 'react';
import {MaterialIcons} from '@expo/vector-icons';

export default function Icon(props: {[key: string]: any}) {
  return (
    <MaterialIcons {...props} />
  )
}
