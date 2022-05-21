import {useState,useEffect} from 'react';
import './LeaderBoard.css';

function LeaderBoard() {
    const [employees, setEmployees] = useState({});
    useEffect(() => {
        fetch(
                "https://interview-booking-api.herokuapp.com/api/bookings")
            .then((res) => res.json())
            .then((json) => {
                let tempEmployees = {};
                json.forEach((obj, index) => {
                    let empId = "";
                    if (obj.employee !== undefined) {
                        empId = obj.employee.id;
                    }
                    const bookId = obj.id;
                    const booking = {
                        hours: bookingHours(obj.checkInDate, obj.checkOutDate),
                        roomType: obj.roomType
                    }
                    if (obj.employee !== undefined) {
                        const employee = {
                            id: obj.employee.id,
                            fName: obj.employee.firstName,
                            lName: obj.employee.lastName,
                            bookings: {
                                [bookId]: booking
                            }
                        }
                        if (typeof(tempEmployees[empId]) === "undefined") {
                            tempEmployees[empId] = employee;
                        } else if (typeof(tempEmployees[empId].bookings[bookId]) === "undefined") {

                            tempEmployees[empId].bookings[bookId] = booking;
                        }
                        setEmployees(tempEmployees);
                        setItems(topBookingSort(tempEmployees).slice(5, 10));
                    }
                })
            })
    }, []);

    //calculate booking hours
    const bookingHours = (checkIn, checkOut) => {
        const checkInDate = checkIn.split("-");
        const formattedCheckIn = checkInDate[2] + "-" + checkInDate[1] + "-" + checkInDate[0];
        const checkOutDate = checkOut.split("-");
        const formattedCheckOut = checkOutDate[2] + "-" + checkOutDate[1] + "-" + checkOutDate[0];
        const bookedTime = Date.parse(formattedCheckOut) - Date.parse(formattedCheckIn);
        let seconds = bookedTime / 1000;
        let minutes = seconds / 60;
        let hours = Math.round(minutes / 60);
        return hours;
    }

    //add up all booking hours for each employee
    const bookingHoursSum = (employees) => {
        let arr = [];
        Object.keys(employees).map(function(keyName, keyIndex) {
            arr.push(employees[keyName]);
        })
        const output = arr.map(d => {
            return [
                ["employee", d],
                ["totalBookingHours", Object.values(d.bookings).reduce((t, {
                    hours
                }) => t + hours, 0)],
                [mostSoldRoomType, mostSoldRoomType(d)]
            ]
        });
        return output;
    }

    //sort after summing up all the booking hours
    const topBookingSort = (employees) => {
        let employeesWithHourSum = [];
        employeesWithHourSum = bookingHoursSum(employees).sort(function(a, b) {
            return a[1][1] - b[1][1];
        });

        return employeesWithHourSum;
    }

    //helper func for mostSoldRoomType()
    const groupByRoomType = (obj, prop) => {
        return obj.reduce(function(acc, item) {
            let key = item[prop]
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(item)
            return acc
        }, {})
    }

    //find most sold room type for each employee
    const mostSoldRoomType = (employee) => {
        let bookingsArr = [];
        for (let booking in employee.bookings) {
            bookingsArr.push(employee.bookings[booking]);
        }
        let resultsArr = [];
        let groupedBooking = groupByRoomType(bookingsArr, 'roomType');
        Object.values(groupedBooking).forEach(item => {
            const sum = item.reduce((accumulator, object) => {
                return accumulator + object.hours;
            }, 0);
            resultsArr.push([sum, item[0].roomType]);

        })
        let sortedByMostSoldRoomType = resultsArr.sort(function(a, b) {
            return a[0] - b[0];
        });
        return sortedByMostSoldRoomType[sortedByMostSoldRoomType.length - 1][1];
    }

    const filterIt = (terms, arr) => {
        if ("" === terms || terms.length < 3) return arr.slice(5, 10);
        const words = terms.match(/\w+|"[^"]+"/g);
        words.push(terms);
        return arr.filter((a) => {
            const v = Object.values(a[0][1]);
            const f = JSON.stringify(v).toLowerCase();
            return words.every(val => f.includes(val));
        });
    };

    const [items, setItems] = useState([]);
    const filterList = ({target}) => {
        const searchQuery = target.value.toLowerCase();
        const updatedList = filterIt(searchQuery, topBookingSort(employees));
        setItems(updatedList);
    };

    const list = ( items ) => {
        return (<ul className="entryContainer">
        {items.map((item,index) => (
            <div key={index} className="parent line">                
            <div>#{5-index} </div>
            <div >{item[0][1].fName} {item[0][1].lName}</div>     
            <div>{item[1][1]}</div>         
            <div>{item[2][1]}</div>      
            </div>
           )
         )}
     </ul>)
    };

    return (
        <div> 
            <h2 className='salesTitle'>Salespersons Leaderboard</h2>
            <input className="search  tField" type="text" placeholder="Search" onChange={filterList} />
            <div>
             <div className="parent titles"> 
            <h3>Place</h3>
            <h3>Name</h3>
            <h3>Total booking hours</h3>
            <h3>Most Sold Room Type</h3>
            </div>
            <div className="entryContainer">
                {list(items)}
            </div>
         </div>    
        </div>   
       );  
   } 
   
   export default LeaderBoard;
