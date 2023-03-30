import React, { useContext, useState } from 'react'
import { Context } from '../context/Context'
const ethers = require("ethers");

const Body = () => {
    const { currentAccount, getEthereumContract } = useContext(Context);
    const [contract, setContract] = useState(getEthereumContract);
    const [currentPage, setCurrentPage] = useState("");
    const [numberOfEvents,setNumberOfEvents] = useState(0);
    const [allEvents,setAllEvents] = useState([]);
    const [myEvents,setMyEvents] = useState([]);

    const [createEventData, setCreateEventData] = useState({
        name: "",
        date: "",
        price: "",
        ticketCount: ""
    });

    const { name, date, price, ticketCount } = createEventData;

    const [buyTicketData, setBuyTicketData] = useState({
        id: "",
        quantity: "",
    });

    const { id, quantity } = buyTicketData;

    const [transferTicketData, setTransferTicketData] = useState({
        _id: "",
        _quantity: "",
        address: ""
    });

    const { _id, _quantity, address } = transferTicketData;

    const onCreateEventChange = (e) => {
        setCreateEventData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }

    const onbuyTicketChange = (e) => {
        setBuyTicketData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }

    const ontransferTicketChange = (e) => {
        setTransferTicketData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }

    const createEvent = async(e) => {
        e.preventDefault();
        const timestamp = Date.parse(date)
        const transaction = await contract.createEvent(name, timestamp, Number(price), Number(ticketCount));
        await transaction.wait();
        var totalEventCount = numberOfEvents + 1;
        setNumberOfEvents(totalEventCount);
        alert("Event created successfully!");
    }

    const buyTicket = async(e) => {
        e.preventDefault();
        var ticketInfo = (await contract.getEventDetails(Number(id)));
        var ticketPrice = ((ticketInfo).price).toNumber();
        const salePrice = ethers.utils.parseUnits((quantity*(ticketPrice)).toString(), 'wei')
        const transaction = await contract.buyTicket(Number(id), Number(quantity),{value:salePrice});
        await transaction.wait();
        alert("Ticket bought successfully!");
    }

    const transferTicket = async(e) => {
        e.preventDefault();
        const transaction = await contract.transferTicket(Number(_id), Number(_quantity), address);
        await transaction.wait();
        alert("Ticket transferred successfully!");
    }

    const getAllEvents = async() => {
        setCurrentPage("getAllEvents");
        var tempArr = [];
        for(let i=0; i<=numberOfEvents; i++){
            tempArr.push(await contract.getEventDetails(i))
        }
        setAllEvents([...tempArr])
    }

    const showMyTickets = async() => {
        var tempArr = [];
        setCurrentPage("showMyTickets");
        for(let i=0; i<=numberOfEvents; i++){
            let temp = await contract.showMyTickets(currentAccount,i);
            if(temp){
                tempArr.push(`${temp} tickets of ${i} id event.`);
            }
        }
        setMyEvents([...tempArr]);
    }

    return (
        <div>
            {
                currentAccount ?
                    <div className='pt-5 pb-5 text-center'>
                        <button className="btn btn-dark" onClick={() => setCurrentPage("createEvent")}>Create Event</button>
                        <button className="btn btn-dark ms-5" onClick={() => setCurrentPage("buyTicket")}>Buy Ticket</button>
                        <button className="btn btn-dark ms-5" onClick={() => setCurrentPage("transferTicket")}>Transfer Ticket</button>
                        <button className="btn btn-dark ms-5" onClick={getAllEvents}>Get All Events</button>
                        <button className="btn btn-dark ms-5" onClick={showMyTickets}>Show My Tickets</button>
                    </div> :
                    <>
                        <h1>Please connect an account to proceed.</h1>
                    </>
            }
            {
                currentPage === "createEvent" ?
                    <>
                        <form onSubmit={createEvent} className="text-center">
                            <input type='text' name='name' value={name} onChange={onCreateEventChange} placeholder="Enter event Name" /><br /><br />
                            <input type='date' name='date' value={date} onChange={onCreateEventChange} placeholder="Enter event Date" /><br /><br />
                            <input type='text' name='price' value={price} onChange={onCreateEventChange} placeholder="Enter Ticket Price" /><br /><br />
                            <input type='text' name='ticketCount' value={ticketCount} onChange={onCreateEventChange} placeholder="Enter Ticket Count" /><br /><br />
                            <button className='btn btn-primary' type='submit'>Confirm Event</button>
                        </form>
                    </> :
                    <>
                        {
                            currentPage === "buyTicket" ?
                                <>
                                    <form onSubmit={buyTicket} className="text-center">
                                        <input type='text' name='id' value={id} onChange={onbuyTicketChange} placeholder="Enter event Id" /><br /><br />
                                        <input type='text' name='quantity' value={quantity} onChange={onbuyTicketChange} placeholder="Enter Quantity" /><br /><br />
                                        <button className='btn btn-primary' type='submit'>Buy</button>
                                    </form>
                                </> :
                                <>
                                    {
                                        currentPage === "transferTicket" ?
                                            <>
                                                <form onSubmit={transferTicket} className="text-center">
                                                    <input type='text' name='_id' value={_id} onChange={ontransferTicketChange} placeholder="Enter event Id" /><br /><br />
                                                    <input type='text' name='_quantity' value={_quantity} onChange={ontransferTicketChange} placeholder="Enter Quantity" /><br /><br />
                                                    <input type='text' name='address' value={address} onChange={ontransferTicketChange} placeholder="Enter Address" /><br /><br />
                                                    <button className='btn btn-primary' type='submit'>Transfer</button>
                                                </form>
                                            </> :
                                            <>
                                                {
                                                    currentPage === "getAllEvents" ?
                                                    <>
                                                        {
                                                            allEvents.map(i=>{
                                                                return(
                                                                    <div className="card ps-5 pe-5 ms-5 me-5 mb-4">
                                                                        <p>Organizer : {i.organizer}</p>
                                                                        <p>Event name : {i.name}</p>
                                                                        <p>Event date : {(i.date).toNumber()}</p>
                                                                        <p>Event price : {(i.price).toNumber()}</p>
                                                                        <p>Tickets Remaining : {(i.ticketRemain).toNumber()}</p>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </>:
                                                    <>
                                                    {
                                                        currentPage === "showMyTickets"?
                                                        <>
                                                           { myEvents.map(i => {
                                                                return(
                                                                    <div className="text-center mt-5">
                                                                        <p>{i}</p>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>:
                                                        <></>
                                                    }
                                                    </>
                                                }
                                            </>
                                    }
                                </>
                        }
                    </>
            }
        </div>
    )
}

export default Body