import {connect} from 'mongoose'

const connectDb = async ()=>{
    try {
        await connect(process.env.MONGO_URL)
        console.log('mongodb connected to server')
    } catch (error) {
        console.log(error)
    }
};

export default connectDb;