
import { useState, useEffect } from 'react';
import './TopWidgets.css';

function TopWidgets() {
    const [bookingSnapshot, setBookingSnapshot] = useState([]);
    useEffect(() => {
                const timerId = setInterval(() => {
                  fetch(
                    "https://interview-booking-api.herokuapp.com/api/booking-snapshot")
                            .then((res) => res.json())
                            .then((json) => { 
                              const tempSnapshot = [];
                              for (const [key, value] of Object.entries(json)) {
                                // console.log(`${key}: ${value}`);
                                tempSnapshot.push([key,value])
                              }
                              setBookingSnapshot(tempSnapshot);                        
                            })
              }, 2000);
              return () => clearInterval(timerId);
     },[]);

    return (
     (
     <div id="widget-container">
        {bookingSnapshot.map((item, index)=>{
         return ( <div  className="circle-Widget" key={index}>
            <span className='widgetTitle'>{item[0]}</span>
            <span className='widgetNumber'>{item[1]}</span> 
        </div>
        )
       })}
       
     </div>)

    ); 

} 

export default TopWidgets;