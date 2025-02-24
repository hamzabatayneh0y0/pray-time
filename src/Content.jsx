import { useEffect, useState } from "react"
import Box from "./box"
export default function Content(){
    let [click,setclick]=useState(false)
    let [sug,setsug]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.sug}
else return []
    });
    let [cun,setcun]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.cun}
else return ""
    })
    let [date,setdate]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.date}
else return ""
    })
    let [selectedCountry,setselectedCountry]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.selectedCountry}
else return ""
    })
    let [load,setload]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.load}
else return false
    })
    let [timeleft,settimeleft]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.timeleft}
else return {hours: 0, minutes: 0, seconds: 0}
    })
    let [info,setinfo]=useState(()=>{
        if(localStorage.getItem("all")!==null){let e=localStorage.getItem("all")
        e=JSON.parse(e);
        return e.info}
else return [
    {
      "src": "https://modo3.com/thumbs/fit630x300/160053/1494445557/%D9%81%D8%B6%D9%84_%D8%B5%D9%84%D8%A7%D8%A9_%D8%A7%D9%84%D8%B5%D8%A8%D8%AD_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF.jpg",
      "pray": "Fajr",
      "time": "06:03"
    },
    {
      "src": "https://modo3.com/thumbs/fit630x300/160053/1494445557/%D9%81%D8%B6%D9%84_%D8%B5%D9%84%D8%A7%D8%A9_%D8%A7%D9%84%D8%B5%D8%A8%D8%AD_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF.jpg",
      "pray": "Dhuhr",
      "time": "12:50"
    },
    {
      "src": "https://modo3.com/thumbs/fit630x300/160053/1494445557/%D9%81%D8%B6%D9%84_%D8%B5%D9%84%D8%A7%D8%A9_%D8%A7%D9%84%D8%B5%D8%A8%D8%AD_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF.jpg",
      "pray": "Asr",
      "time": "16:03"
    },
    {
      "src": "https://modo3.com/thumbs/fit630x300/160053/1494445557/%D9%81%D8%B6%D9%84_%D8%B5%D9%84%D8%A7%D8%A9_%D8%A7%D9%84%D8%B5%D8%A8%D8%AD_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF.jpg",
      "pray": "Maghrib",
      "time": "18:31"
    },
    {
      "src": "https://modo3.com/thumbs/fit630x300/160053/1494445557/%D9%81%D8%B6%D9%84_%D8%B5%D9%84%D8%A7%D8%A9_%D8%A7%D9%84%D8%B5%D8%A8%D8%AD_%D9%81%D9%8A_%D8%A7%D9%84%D9%85%D8%B3%D8%AC%D8%AF.jpg",
      "pray": "Isha",
      "time": "19:38"
    }
  ]

    })



//local storage
useEffect(()=>{
    let time=setTimeout(() => {
        localStorage.setItem("all",JSON.stringify({sug,cun,date,info,timeleft,load,selectedCountry}))
    }, 1000);
return ()=>{clearTimeout(time)}   
},[selectedCountry,load,info,cun,sug,date,timeleft])
async function getSug(){
    try{
        let response=await fetch(`http://api.geonames.org/searchJSON?q=${cun}&maxRows=10&username=hamza0_0batayneh`)
    if (!response.ok){throw "feth error"}
    let data=await response.json()
   data=[...new Map(data.geonames.filter((el)=>el.adminName1!=="").map((el)=>{
    return [`${el.lng},${el.lat}`,{
        name:`${el.name}`,
        countryName:`${el.countryName} `,
    countryCode:`${el.countryCode}`}]
    
    }

    )).values()]
    setload(false)
    setsug(data)
    }
    catch(error){
        console.log(error)
    }
    
}
let isvisible=cun.trim().length===0?false:true;
useEffect(()=>{
    if(cun.trim().length===0)
       {
        setsug([])
        setload(false)
        return ;
       }
       setload(true)
       setsug([])
       let wait =setTimeout(()=>{
       getSug()

         },500)
       return ()=>{clearTimeout(wait)}
},[cun])

async function gettimes(){
    try{
    let response = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${selectedCountry}&method=2`);

    if (!response.ok){throw "feth error"}
    let data=await response.json()
    let newa=[...info];

    newa=newa.map((el)=>{
       return {...el,time:data.data.timings[el.pray]}
    })
setinfo(newa)
setdate(data.data.date.gregorian.date)
    
  
    }
    catch(error){
        console.log(error)
    }
}

useEffect(()=>{
    if(selectedCountry.length>0)
    {
        gettimes()}
},[selectedCountry])
//set time left
useEffect(()=>{
let time=setInterval(() => {
    let now=new Date()
now= now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); 

    let myprays=info.map((el)=>{let [h,m]=el.time.split(":").map(Number)
        return h*3600+m*60
     })
    let mypray=myprays.find((el)=>{return el>now})
  
    
    if (!mypray) {
        mypray = myprays[0] + 24 * 3600; // Add 24 hours to loop to the next day
    }
let def=(mypray-now);
let hours=Math.floor(def/(60*60))
let minutes=Math.floor(def%(60*60)/(60))
let seconds=Math.floor(def%(60))
settimeleft({hours,minutes,seconds})
}, 1000);
    return ()=>{clearInterval(time)}
},[info])

    return (
        <div className="content">
        <div className="container">
        <div className="header">
            <div className="info">
             <p className="date">{date}</p>
             <p className="city">{selectedCountry}</p>
            </div>
            <div className="time-left">
                <span>the time left for next pray:</span>
                <p>{timeleft.hours}:{timeleft.minutes}:{timeleft.seconds}</p>
            </div>
        </div>
        <div className="boxes">
           <div className="container">
           {info.map((el,i)=>{
                return <Box key={i} src={info[i].src} pray={info[i].pray} time={info[i].time}/>
            })}
           </div>
            
        </div>
        <div className="country">
            <div className="container">
                <input placeholder="المدينة" value={cun} onChange={(e)=>{
                    setcun(e.target.value)
                    setclick(false)
                }}/>
              { isvisible&&!click && <ul className="sug">
                 {load &&<p style={{color:"#ffffff54"}}>loading</p>}
                  {sug.length===0&&load===false?<p style={{color:"#ffffff54"}}>nothing found</p>:sug.map((el,i)=>{
                    
                    return <li key={i} className="sug-country" onClick={(e)=>{
                        e.target.classList.add("hi")
                      setclick(true)
                        setTimeout(()=>{e.target.classList.remove("hi")},300)
                        setselectedCountry(e.target.innerHTML)
                        setcun(e.target.innerHTML)
                        
                        
                    }}>{el.name},{el.countryName}</li>
               
                  })}
                </ul>}
            </div>
        </div>
        </div>
        </div>
    )
}