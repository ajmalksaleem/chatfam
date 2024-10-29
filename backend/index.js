import express from 'express'
import connectDb from "./db/connect.js";
import { config } from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/message.routes.js'
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import path from 'path'

const app = express()

config()
app.use(express.json())
app.use(cookieParser())

const __dirname = path.resolve()

connectDb()

  app.use("/api/user", userRoutes);
  app.use('/api/chat', chatRoutes)
  app.use('/api/message', messageRoutes)

  app.use(express.static(path.join(__dirname,'/Frontend/dist')))

  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
  })

  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

  const server = app.listen(3000, () => {
    console.log("server started running  .!");
  });

  const io = new Server(server, {
    pingTimeout: 60000, 
    cors: {
      origin: 'http://localhost:5173',
      // credentials: true, 
    },
  });

  io.on('connection', (socket)=>{
    console.log('connected to socket.io')

    socket.on("setup", (userData)=>{
      socket.join(userData._id)
      console.log(userData._id)
      socket.emit("connected")
    })
    
    socket.on("join chat", (room)=>{
      socket.join(room)
      console.log("user joined room"+room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived)=>{
      try {
        const chat = newMessageReceived.chat;
        if (!chat.users) {
          console.log('Chat users not defined');
          return;
        }
        chat.users.forEach((user) => {
          if (user._id == newMessageReceived.sender._id) return;
          socket.in(user._id).emit("message received", newMessageReceived);
        });
      } catch (error) {    
        console.error('New message error:', error);
      }
    })
    socket.off("setup", (userData)=>{
     console.log("USER DISCONNECTED")
      socket.leave(userData._id)
    })
  })
  