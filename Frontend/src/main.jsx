import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { store, persistor } from './redux/store.js'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ChatProvider from './context/chatProvider.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
    <BrowserRouter>
    <ChatProvider>
    <Toaster />
    <App />
    </ChatProvider>
    </BrowserRouter>
    </Provider>
  </PersistGate>
  
)
