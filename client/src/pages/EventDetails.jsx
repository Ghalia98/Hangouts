import { React, useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from "../context/auth";
import axios from 'axios';
import EventDeleteBtn from '../components/EventDeleteBtn';
import GoingBtn from '../components/GoingBtn';
import GoingList from '../components/GoingList';
import './EventDetails.css'


function EventDetails() {
    const { id } = useParams()
    const [event, setEvent] = useState(null)
    const { user: currentUser } = useContext(AuthContext)

    const getEvent = () => {
        const storedToken = localStorage.getItem('authToken')
        axios.get(`/api/events/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then(res => setEvent(res.data))
            .catch(err => console.log(err))
    }

    const handleGoingList = () => {
        console.log(event._id)
        const storedToken = localStorage.getItem('authToken')
        axios.put(`/api/events/${event._id}/update/going-list`, { currentUserName: currentUser.name }, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))

        getEvent()
    }
    useEffect(() => {
        getEvent();
    }, [])
    console.log(event)
    return (
        <>
            <div className='event-details'>
                <div className='section one'>
                    {event === null ? 'Loading' : <>
                        <h3><strong>Title:</strong> {event.title}</h3>
                        <p><strong>Date:</strong> {event.date} </p>
                        <p><strong>Time:</strong> {event.time} </p>
                        <p><strong> Location:</strong> {event.location}</p>
                        <p><strong>Description:</strong> {event.description}</p>

                    </>
                    }


                    {event?.creator._id === currentUser?._id &&
                        <>
                            <Link to={`/events/${id}/edit`}>
                                <button>Edit</button>
                            </Link>
                            < EventDeleteBtn eventId={id} />
                        </>
                    }

                    <GoingBtn handleGoingList={handleGoingList} />
                </div>
                <div className='section two'>
                    <div>
                        {event === null ? 'Loading' : <>
                            <ul><strong>GuestList:</strong> {event.guestList.map((guest, index) => <li key={index}> {guest} </li>
                            )}</ul>
                        </>
                        }
                    </div>
                    <div className='going-list'>
                        <GoingList handleGoingList={handleGoingList} event={event} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default EventDetails