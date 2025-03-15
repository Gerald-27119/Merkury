export default function Spot({spot}) {
    return (
        <div>
            <img src={spot.photos[0].url} alt={spot.name}/>
            <h2>{spot.name}</h2>
            <div>{spot.rating}</div>
            <span>{spot.description}</span>
        </div>
    )
}