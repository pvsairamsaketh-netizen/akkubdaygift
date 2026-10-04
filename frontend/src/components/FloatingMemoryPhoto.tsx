import React from 'react';

/**
 * FloatingMemoryPhoto is disabled as requested by the user:
 * "REMOVE the current behavior where: 'My Gorgeous Akku' appears as a floating bottom-right popup containing the photo.
 *  That component should NO LONGER be used for this photo reveal.
 *  Replace the interaction with the integrated memory experience."
 */
interface FloatingMemoryPhotoProps {
  reduceMotion?: boolean;
}

export const FloatingMemoryPhoto: React.FC<FloatingMemoryPhotoProps> = () => {
  return null;
};
