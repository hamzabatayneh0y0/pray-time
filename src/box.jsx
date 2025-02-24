export default function Box({src,pray,time}){
    return (
        <div className="box">
       <img src={src} alt="img"/>
       <div className="info-box">
        <p className="pray">{pray}</p>
        <p className="time-box" >
{time}
        </p>
       </div>
        </div>
    )
}