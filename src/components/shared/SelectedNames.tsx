import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NameChip from './NameChip'; // Make sure to import your NameChip component
import { Name } from '@/app/admin/dashboard/page';

interface SelectedNamesProps {
  selectedNames: Name[];
  handleNameDeselect: (name: Name) => void;
  style?: React.CSSProperties;
}

const SelectedNames: React.FC<SelectedNamesProps> = ({ selectedNames, handleNameDeselect, style }) => {
  return (
    <div>
      <Typography className="p-3 pt-0 pb-0" variant="h6" gutterBottom>
        Selected Names (10 names to submit)
      </Typography>
      <Box sx={style}>
        {selectedNames.map((name) => (
          <NameChip
            key={name._id}
            name={name}
            handleNameDeselect={handleNameDeselect}
          />
        ))}
      </Box>
    </div>
  );
};

export default SelectedNames;
