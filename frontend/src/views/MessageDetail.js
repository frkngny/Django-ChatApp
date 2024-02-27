import React, { useState, useEffect } from 'react';
import './style/Inbox.css';
import useAxios from '../utils/useAxios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import VerifyToken from "../utils/VerifyToken";


function MessageDetail(props) {
    const baseURL = 'http://127.0.0.1:8000/api';
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const params = useParams();
    const id = props.props.id;
    const axios = useAxios();
    const token = localStorage.getItem('authTokens');
    const decoded = VerifyToken(token);
    const user_id = decoded.user_id;

    function getMessages(){
        try {
            axios.get(baseURL + '/get-messages/' + user_id + '/' + id).then((res) => {
                setMessages(res.data);
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMessages();
        let interval = setInterval(getMessages, 2000);
        return () => { clearInterval(interval); }
    }, [id]);
    
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    }

    const sendMessage = () =>{
        const formData = new FormData();
        formData.append("user", user_id);
        formData.append("sender", user_id);
        formData.append("receiver", id);
        formData.append("message", newMessage);
        formData.append("is_read", false);
        
        try {
            axios.post(baseURL + '/send-message', formData).then((res) => {
                console.log(res.data);
                setNewMessage("");
            });
            
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <div>
            <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                        <img src={messages[0] ? messages[0].sender_profile.user.id === user_id ? messages[0].receiver_profile.image : messages[0].sender_profile.image : null} className="rounded-circle mr-1" alt="usr" width={40} height={40} />
                    </div>
                    <div className="flex-grow-1 pl-3">
                        <strong>{messages[0] ? messages[0].sender_profile.user.id === user_id ? messages[0].receiver_profile.full_name : messages[0].sender_profile.full_name : null}</strong>
                        <div className="text-muted small">
                            <em>Online</em>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary btn-lg mr-1 px-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone feather-lg" >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </button>
                        <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-video feather-lg" >
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                            </svg>
                        </button>
                        <button className="btn btn-light border btn-lg px-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal feather-lg">
                                <circle cx={12} cy={12} r={1} />
                                <circle cx={19} cy={12} r={1} />
                                <circle cx={5} cy={12} r={1} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="position-relative">
                <div className="chat-messages p-4">
                    {messages.map((msg) =>
                        <div className={msg.sender_profile.user.id === user_id ? "chat-message-right pb-4" : "chat-message-left pb-4"}>
                            <div>
                                <img src={msg.sender_profile.image} className="rounded-circle mr-1" alt={msg.sender_profile.full_name} width={40} height={40}/>
                                <div className="text-muted small text-nowrap mt-2">
                                    {moment.utc(msg.date).local().startOf('seconds').fromNow()}
                                </div>
                            </div>
                            <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                <div className="font-weight-bold mb-1">{msg.sender_profile.user.id === user_id ? "You" : msg.sender_profile.full_name}</div>
                                {msg.message}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-grow-0 py-3 px-4 border-top">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type your message" name="message" value={newMessage} onChange={handleMessageChange}/>
                    <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default MessageDetail;