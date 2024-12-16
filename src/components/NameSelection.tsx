import React from 'react';
import SelectedNames from './shared/SelectedNames';
import SubmitButton from './shared/SubmitButton';
import NameSelectorGrid from './NameSelectorGrid';
import { Name } from '@/app/admin/dashboard/page';

interface NameSelectionProps{
    selectedNames: Name[];
    handleNameDeselect: (name: Name) => void;
    handleSubmit: () => void;
    girlNames: Name[];
    boyNames: Name[];
    handleSelectName: (name: Name) => void;
    submittingNames: boolean;
}

const style = {
	py: 0,
	width: "100%",
	borderRadius: 2,
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "background.paper",
	padding: "5px",
};

const NameSelection: React.FC<NameSelectionProps> = ({
  selectedNames,
  handleNameDeselect,
  handleSubmit,
  girlNames,
  boyNames,
  handleSelectName,
  submittingNames
}) => {
  return (
    <div>
      <SelectedNames
        selectedNames={selectedNames}
        handleNameDeselect={handleNameDeselect}
        style={style}
      />
      <SubmitButton
        selectedNames={selectedNames}
        submittingNames={submittingNames}
        handleSubmit={handleSubmit}
      />
      <NameSelectorGrid
        girlNames={girlNames}
        boyNames={boyNames}
        selectedNames={selectedNames}
        handleSelectName={handleSelectName}
      />
    </div>
  );
};

export default NameSelection;
