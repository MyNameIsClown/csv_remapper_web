import './Card.css'

function Card(
    title:string,
    content:string,
){
    return(
        <div className='card'>
            <h3>{title}</h3>
            <p>{content}</p>
        </div>
    )
}

export default Card