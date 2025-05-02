import { io } from 'socket.io-client';

const socket = io('http://localhost:5003'); // Your backend port

export default socket;
