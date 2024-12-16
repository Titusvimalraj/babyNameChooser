import React from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Name } from '@/app/admin/dashboard/page';

interface SubmitButtonProps {
  selectedNames: Name[];
  submittingNames: boolean;
  handleSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ selectedNames, submittingNames, handleSubmit }) => {
  return (
    <div className="p-3">
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        disabled={selectedNames.length < 10 || submittingNames}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default SubmitButton;
