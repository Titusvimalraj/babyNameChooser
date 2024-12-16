import React from 'react';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import Face2Icon from '@mui/icons-material/Face2';
import { Name } from '../../app/admin/dashboard/page';

const NameChip = ({ name, handleNameDeselect }: {name:Name; handleNameDeselect:(name:Name)=>void}) => {
  return (
    <Chip
      icon={name.type === 'boy' ? <FaceIcon /> : <Face2Icon />}
      color={name.type === 'boy' ? 'primary' : 'secondary'} // Use primary for blue and secondary for pink
      style={{
        backgroundColor: name.type === 'boy' ? "#3e51eb" : '#eb3dbc',
        color: 'white',
        fontSize: 12,
        margin: '5px',
      }}
      key={name._id}
      label={name.name}
      onDelete={() => handleNameDeselect(name)}
    />
  );
};

export default NameChip;
