import React from 'react';
import './style/Inbox.css';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import VerifyToken from "../utils/VerifyToken";
import MessageDetail from './MessageDetail';


function Inbox() {
    const baseURL = 'http://127.0.0.1:8000/api';
    // Create New State
    const [messages, setMessages] = useState([])
    let [newSearch, setNewSearch] = useState({ search: "", });
    let [openMsg, setopenMsg] = useState(-1);

    // Initialize the useAxios Function to post and get data from protected routes
    const axios = useAxios();

    // Get and Decode Token
    const token = localStorage.getItem('authTokens');
    const decoded = VerifyToken(token);
    // Get Userdata from decoded token
    const user_id = decoded.user_id;
    //const username = decoded.username;
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // Send a get request to the api endpoint to get the message of the logged in user
            axios.get(baseURL + '/my-messages/' + user_id).then((res) => {
                // Set the data that was gotten back from the database via the api to the setMessage state
                setMessages(res.data);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleSearchChange = (e) => {
        setNewSearch({
            ...newSearch,
            [e.target.name]: e.target.value,
        });
    };

    const SearchUser = () => {
        axios.get(baseURL + '/search-user/' + newSearch.username)
            .then((res) => {
                if (res.status === 404) {
                    alert("User does not exist");
                } else {
                    navigate('/search-user/' + newSearch.username);
                }
            })
            .catch((error) => {
                alert("User Does Not Exist");
            });
    };

    function openMessageDetail(id) {
        setopenMsg(id);
    }

    return (
        <div>
            <main className="content" style={{ marginTop: "150px"}}>
                <div className="container p-0" >
                    <h1 className="h3 mb-3">Messages</h1>
                    <div className="card" >
                        <div className="row g-0" style={{}}>
                            <div className="col-12 col-lg-5 col-xl-3 border-right" style={{padding: '20px'}}>
                                <div className="px-4 ">
                                    <div className="d-flfex align-itemfs-center">
                                        <div className="flex-grow-1 d-flex align-items-center mt-2">
                                            <input type="text" className="form-control my-3" placeholder="Search..." onChange={handleSearchChange} name='username'/>
                                            <button className='ml-2' onClick={SearchUser} style={{ border: "none", borderRadius: "50%" }}><i className='fas fa-search'></i></button>
                                        </div>
                                    </div>
                                </div>
                                {messages.map((message) =>
                                    /*<Link to={"/inbox/" + (message.sender.id === user_id ? message.receiver.id : message.sender.id)} href="#" className="list-group-item list-group-item-action border-0">
                                        <small><div className="badge bg-success float-right text-white">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div></small>
                                        <div className="d-flex align-items-start">
                                            {message.sender.id !== user_id ?
                                                <img src={message.sender_profile.image} className="rounded-circle mr-1" style={{objectFit:"cover"}} width={40} height={40} />
                                                :
                                                <img src={message.receiver_profile.image} className="rounded-circle mr-1" style={{objectFit:"cover"}} width={40} height={40} />
                                            }
                                            <div className="flex-grow-1 ml-3">
                                                {message.sender.id === user_id ?
                                                    (message.receiver_profile.full_name !== "" ? message.receiver_profile.full_name : message.receiver.username)
                                                    :
                                                    (message.sender_profile.full_name !== "" ? message.sender_profile.full_name : message.sender.username)
                                                }
                                                <div className="small">
                                                    <small>{message.message}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>*/
                                    <a onClick={() => openMessageDetail((message.sender_profile.user.id === user_id ? message.receiver_profile.user.id : message.sender_profile.user.id))} className="list-group-item list-group-item-action border-0">
                                        <small><div className="badge bg-success float-right text-white">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div></small>
                                        <div className="d-flex align-items-start">
                                            {message.sender_profile.user.id !== user_id ?
                                                <img src={message.sender_profile.image} className="rounded-circle mr-1" style={{objectFit:"cover"}} width={40} height={40} />
                                                :
                                                <img src={message.receiver_profile.image} className="rounded-circle mr-1" style={{objectFit:"cover"}} width={40} height={40} />
                                            }
                                            <div className="flex-grow-1 ml-3">
                                                {message.sender_profile.user.id === user_id ?
                                                    (message.receiver_profile.full_name !== "" ? message.receiver_profile.full_name : message.receiver.username)
                                                    :
                                                    (message.sender_profile.full_name !== "" ? message.sender_profile.full_name : message.sender.username)
                                                }
                                                <div className="small">
                                                    <small>{message.message}</small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </a>
                                )}
                                <hr />
                            </div>
                            <div className="col-12 col-lg-7 col-xl-9">
                                {openMsg < 0 ? null : <MessageDetail props={{'id':openMsg}}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Inbox