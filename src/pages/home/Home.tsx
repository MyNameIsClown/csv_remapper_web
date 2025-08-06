import './Home.css'
import Card from '../../components/Card/Card'
import Footer from '../../components/Footer/Footer';
import type { ChangeEvent } from 'react';
import { uploadFile } from '../../utils/fileHandler'

async function handleUploadInput(e: ChangeEvent<HTMLInputElement>){
  const files = e.target.files;
  if (files != null && files.length != 0) {
    uploadFile(files[0])
  }
}
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
  

function Home(){
    return (
        <>
            <div className='content'>
                <div className='intro'>
                    <h1>CSV REMAPPER</h1>
                    <p>
                    CSV Remapper is a powerful web tool designed to easily transform and manipulate CSV files using customizable mapping files. Streamline your data workflows and automate common CSV cleaning and transformation tasks.
                    </p>
                    <label htmlFor="uploadBtn" className='upload-btn'>UPLOAD FILE</label>
                    <input id='uploadBtn' type='file' accept='.csv,.tsv,.json' onChange={(e) => handleUploadInput(e)}/>
                </div>
                <div className='card-grid'>
                    {cardInfo.map(info => (
                        <Card key={info.title} className='card-item'>
                            <h1>{info.title}</h1>
                            <p>{info.body}</p>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default Home