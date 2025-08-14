import './Home.css'
import Card from '../../components/Card/Card'
import type { ChangeEvent } from 'react';
import { uploadFile } from '../../utils/fileHandler'
import { useNavigate } from 'react-router';
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemText, styled, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from '../../components/NavigationMenu/NavBar';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const cardInfo = [
  {
    title: "Rename columns",
    body: "Rename column headers automatically using your predefined mapping rules.",
  },
  {
    title: "Remove columns",
    body: "Clean your data by removing unnecessary or irrelevant columns.",
  },
  {
    title: "Merge columns",
    body: "Combine values from multiple columns into one, with full control over order and separator.",
  },
  {
    title: "Convert values to positive",
    body: "Ensure all numeric values are positive by transforming them to their absolute value.",
  },
  {
    title: "Convert values to negative",
    body: "Invert numeric values by converting them into their negative equivalents.",
  },
  {
    title: "Normalize dates",
    body: "Unify date formats across columns for consistent parsing and processing.",
  },
];


function Home() {
  let navigate = useNavigate()

  const handleUploadInput = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files != null && files.length != 0) {
      uploadFile(files[0]).then((data) => {
        navigate(`/remapper/${data.file_id}`, { state: { types: data.types } })
      })
    }
  }
  const navItems = ["Cosa 1"]
  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='content'>
      <div className='intro'>
        <h1>CSV REMAPPER</h1>
        <p>
          CSV Remapper is a powerful web tool designed to easily transform and manipulate CSV files using customizable mapping files.<br />
          Streamline your data workflows and automate common CSV cleaning and transformation tasks.
        </p>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          color='secondary'
          sx={{
            fontSize: "2rem"
          }}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(e) => handleUploadInput(e)}
            multiple
          />
        </Button>
      </div>
      <div className='card-grid'>
        {cardInfo.map(info => (
          <Card key={info.title} className='card-item' variant='gradient'>
            <h1>{info.title}</h1>
            <p>{info.body}</p>
          </Card>
        ))}
      </div>
      <Navbar drawer={drawer} navItems={navItems} />
    </div>
  )
}
export default Home