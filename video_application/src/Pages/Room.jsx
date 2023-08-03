import React, { useEffect } from 'react'
import {useSocket} from '../Providers/Socket'
import { usePeer } from '../Providers/Peer';
const Room = () => {
    const {socket}=useSocket();
    const {peer,createOffer} =usePeer()

    const handleNewUserJoined=async(data)=>{
        const {emailId}=data
       console.log('New user joined room',emailId);
       const offer=await createOffer();
       
    }
    
    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
    },[socket]);
  return (
    <div className='room-page-container'>Room</div>
  )
}

export default Room