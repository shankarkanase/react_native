import React from 'react';
import { Button } from 'react-native';

export default function DataListButton({ onPress }) {
  return (
    <Button
      title="View Data Listing"
      onPress={onPress}
    />
  );
}
