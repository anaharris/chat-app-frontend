import ActionCable from 'actioncable'
import store from './store.js'
const Cookies = require('cookies-js')

// login
const loggedIn = (userData) => ({type: 'LOGGED_IN', userData})

const loggingIn = (username, password) => {
  return (dispatch) => {
    const url = 'http://localhost:5000/login'
  let data = { user: {username: username, password: password} }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.message)
      } else {
        Cookies.set('token', data.jwt)
        dispatch(loggedIn(data.user))
      }
    })
  }
}

// logout
const logout = () => ({type: 'LOGGED_OUT'})


// fetch user
const checkedUser = (userData) => ({type: 'CHECKED_USER', userData})

const checkingForUser = (token) => {
  return (dispatch) => {
    const token = Cookies.get('token')
    const url = 'http://localhost:5000/profile'
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        dispatch(checkedUser(data.user))
      })
  }
}


// on componentDidMount
const receiveMessage = (message) => ({type: 'RECEIVE_MESSAGE', message})

const createSocket = () => {
  return (dispatch) => {
    const token = Cookies.get('token')
    const url = 'ws://localhost:5000/cable'
    let App = {}
    App.cable = ActionCable.createConsumer(`${url}?token=${token}`)

    const messagesSubscription = App.cable.subscriptions.create({channel: 'MessagesChannel', conversation_id: store.getState().selectedConversation}, {
      connected: () => {
        console.log('connected to messages stream')
      },
      disconnected: () => {
        console.log('disconnected from messages stream')
      },
      received: (data) => {
        // check data object
        // if it has data.content it's a message
        // if it doesn't it's a "{username} is typing (could be stored in data.status)"
        dispatch(receiveMessage(data))
      }
    })
      console.log('socket')
      App.conversations = [messagesSubscription]
      window.App = App
  }
}

// onClick on a particular conversation
const fetchedConversation = (selectedConversation) => ({type: 'FETCHED_CONVERSATION', selectedConversation})

const fetchingConversation = (id) => {
  return (dispatch) => {
    fetch(`http://localhost:5000/conversations/${id}`)
      .then(res => res.json())
      .then(data => {
        dispatch(fetchedConversation(data))
      })
  }
}

// onKeyDown for Conversation Input
const sendMessage = (message) => ({type: 'SEND_MESSAGE', messageInput: message})

const sendingMessage = (message) => {
  return (dispatch) => {
    window.App.conversations[0].send({content: message, conversation_id: store.getState().selectedConversation.id})
    dispatch(sendMessage(message))
  }
}


// const sendStatus = (message) => ({type: 'SEND_STATUS', messageInput: message})
//
// const sendingStatus = (message) => {
//   // format the status message
//   return (dispatch) => {
//     window.App.conversations[0].send({status: message, conversation_id: store.getState().selectedConversation.id})
//     dispatch(sendMessage(message))
//   }
// }

export { sendingMessage, fetchingConversation, receiveMessage, checkingForUser, loggingIn, logout, createSocket }