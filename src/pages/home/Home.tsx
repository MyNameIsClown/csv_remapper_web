import './Home.css'
import Card from '../../components/Card/Card'
import { type ChangeEvent } from 'react';
import { saveFileId, uploadFile } from '../../utils/fileHandler'
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from '../../components/NavigationMenu/NavBar';
import { useLoading } from '../../utils/LoadingContext';
import VisuallyHiddenInput from '../../components/VisuallyHidenInput';
import { usePopUp } from '../../utils/PopUpContext';
import { BaseErrorDialog } from '../../components/ErrorDialogs/ErrorDialogs';

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
  const {setLoading} = useLoading();
  const {setOpen, setContent} = usePopUp();

  const handleUploadInput = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    e.preventDefault();
    const files = e.target.files;
    if (files != null && files.length != 0) {
      uploadFile(files[0]).then((data) => {
        saveFileId(data["file_id"])
        setLoading(false)
        navigate(`/remapper/${data.file_id}`, { state: { types: data.types } })
      }).catch((error:Error)=>{
        setLoading(false)
        setContent(<BaseErrorDialog error={error}/>)
        setOpen(true)
      })
    }
  }
  const navItems = ["@Víctor Carrasco", "2025"]

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
      <Navbar navItems={navItems} />
    </div>
  )
}
export default Home