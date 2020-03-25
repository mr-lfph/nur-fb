import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''

  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        console.log(res);
        const { displayName, photoURL, email, password } = res.user;
        const signedinUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          password: password
        }
        setUser(signedinUser);
      })
      .catch(er => {
        console.log(er);
        console.log(er.message);
      })
  }
  const handleSignOut = () => {
    firebase.auth().signOut().then(res => {
      const signOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false
      }
      setUser(signOutUser);
    })
      .catch(er => {
        console.log(er);
      }
      )
  }
  const isValidEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
   // console.log(e.target.checked);
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = e => {
    const newUserInfo = {
      ...user
    }
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = isValidEmail(e.target.value);
    }

    if (e.target.name === 'password') {
      isValid = e.target.value.length > 6 && hasNumber(e.target.value)
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        }).catch(er => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = er.message;
          setUser(createdUser);
          console.log(er);
        })
      console.log(user.email, user.password);
    }
    else {

      console.log('Form is not valid!', user);
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        }).catch(er => {
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = er.message;
          setUser(createdUser);
          console.log(er);
        })
      console.log(user.email, user.password);
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      <h2>Welcome to Firebase React App</h2>
      <br />
      {
        user.isSignedIn ? <button className="button-width" onClick={handleSignOut} >SignOut</button> :
          <button className="button-width" onClick={handleSignIn} >SignIn</button>}
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h2>Own Authentication </h2>
      <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm} />
      <label htmlFor="switchForm">Existing User</label>
      <form style={{ display: user.existingUser ? 'block' : 'none' }} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Password" required />
        <br />
        <input className="button-width" type="submit" value="SignIn" />
      </form>

      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount} >
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required />
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder="Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Password" required />
        <br />
        <input type="submit" value="Create Account" className="button-width" />
      </form>
      {user.error && <p style={{ color: 'red' }}>{user.error}</p>}
    </div>
  );
}

export default App;
