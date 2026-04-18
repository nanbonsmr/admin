import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface SimpleGridProps extends BoxProps {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({ 
  container, 
  item, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  spacing, 
  children, 
  sx,
  ...props 
}) => {
  let gridSx: any = { ...sx };

  if (container) {
    gridSx = {
      ...gridSx,
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing ? `${spacing * 8}px` : 0,
    };
  }

  if (item) {
    let flexBasis = '100%';
    if (xs) flexBasis = `${(xs / 12) * 100}%`;
    if (sm && window.innerWidth >= 600) flexBasis = `${(sm / 12) * 100}%`;
    if (md && window.innerWidth >= 900) flexBasis = `${(md / 12) * 100}%`;
    if (lg && window.innerWidth >= 1200) flexBasis = `${(lg / 12) * 100}%`;
    if (xl && window.innerWidth >= 1536) flexBasis = `${(xl / 12) * 100}%`;

    gridSx = {
      ...gridSx,
      flexBasis,
      maxWidth: flexBasis,
    };
  }

  return (
    <Box sx={gridSx} {...props}>
      {children}
    </Box>
  );
};