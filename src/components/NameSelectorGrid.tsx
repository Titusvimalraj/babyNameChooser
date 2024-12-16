import React from 'react';
import Grid from "@mui/material/Grid2";
import NamesSelector from './shared/NamesSelector';
import { Name } from '@/app/admin/dashboard/page';

interface NamesSelectorGridProps {
  girlNames: Name[];
  boyNames: Name[];
  selectedNames: Name[];
  handleSelectName: (name: Name) => void;
}

const NamesSelectorGrid: React.FC<NamesSelectorGridProps> = ({ girlNames, boyNames, selectedNames, handleSelectName }) => {
  return (
    <Grid container spacing={2} columns={16}>
      <Grid size={8}>
        <NamesSelector
          NameType="girl"
          titleHeading="Girl Names"
          Names={girlNames}
          selectedNames={selectedNames}
          handleSelectName={handleSelectName}
        />
      </Grid>
      <Grid size={8}>
        <NamesSelector
          NameType="boy"
          titleHeading="Boy Names"
          Names={boyNames}
          selectedNames={selectedNames}
          handleSelectName={handleSelectName}
        />
      </Grid>
    </Grid>
  );
};

export default NamesSelectorGrid;
