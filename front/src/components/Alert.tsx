import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertProps {
  title: string;
  content: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleYes: React.MouseEventHandler<HTMLButtonElement>;
}

const Alert = ({ title, content, visible, setVisible, handleYes }: AlertProps): JSX.Element => {
  const handleClose = (): void => {
    setVisible(false);
  };

  return (
    <div>
      <Dialog
        open={visible}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYes}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Alert;
