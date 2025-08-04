import './Home.css'
import Card from './Card'

function Home(){
    return (
        <>
            <div className='intro'>
                <h1>CSV Remapper</h1>
                <p>
                    CSV Remapper is a web tool for making transformations and changes to csv files
                </p>
                <button>
                    Upload file
                </button>
            </div>
            <div className='carousel'>
                {Card("Renaming", "Renamming actions")}
                {Card("Renaming", "Renamming actions")}
                {Card("Renaming", "Renamming actions")}
            </div>
        </>
    )
}
export default Home