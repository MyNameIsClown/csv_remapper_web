import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box, Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { usePopUp } from '../../utils/PopUpContext';


export default function PopUp() {
  const {isOpen, setOpen, content} = usePopUp();

  return (
    <Dialog open={isOpen} onClose={()=>setOpen(false)}>
        <Box
          sx={{display: 'flex', justifyContent: "space-between"}}
        >
          <DialogTitle>
            Error
          </DialogTitle>
          <IconButton onClick={()=>setOpen(false)}>
            <Close/>
          </IconButton>
        </Box>
        <Container>
          {content}
        </Container>
    </Dialog>
  );
}
