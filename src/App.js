import React, {useState, useEffect } from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Input } from '@material-ui/core'
import Post from './Post'
import { db, auth } from './firebase'
import ImageUpload from './ImageUpload'
import './styles/App.css';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]); 
  const [openModal, setOpenModal] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [user, setUser] = useState(null); 

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const postsComponents = posts.map(el => {
    return (
      <Post
        key={el.id}
        postId={el.id}
        user={user}
        content={el.post}
      />
    )
  })

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName : username,
        })
      })
      .catch((error) => alert(error.message));

    setOpenModal(false)
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        // if (authUser.displayName) {
        //   // dont update username
        // } else {
        //   // if we just crated someone
        //   return authUser.updateProfile( {
        //     displayName : username,
        //   })
        // }

      } else {
        // user has logged out...
        setUser(null)
      }
    });

    return () => {
      // perform has cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id : doc.id,
        post : doc.data()
      })));
    })
  }, [])

  return (
    <div className="app">
      <Modal
        open={openModal}
        onClose={ () => setOpenModal(false) }
      >
      <div style={modalStyle} className={classes.paper}>
        <form className='app__signUp'>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt="logo"
            />
          </center>
          <Input
            placeholder='username'
            type='text'
            value={username}
            onChange={ (e) => setUsername(e.target.value)}
          />
          <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={ (e) => setEmail(e.target.value)}
          />
          <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={ (e) => setPassword(e.target.value)}
          />
          <Button type='submit' onClick={ signUp }>Sign Up</Button>
        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={ () => setOpenSignIn(false) }
      >
      <div style={modalStyle} className={classes.paper}>
        <form className='app__signUp'>
          <center>
            <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              alt="logo"
            />
          </center>
          <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={ (e) => setEmail(e.target.value)}
          />
          <Input
            placeholder='password'
            type='password'
            value={password}
            onChange={ (e) => setPassword(e.target.value)}
          />
          <Button type='submit' onClick={ signIn }>Sign Up</Button>
        </form>
      </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="logo"
        />
        <div className='app__headerButtons'>
          {user ? 
            <Button onClick={ () => auth.signOut() }>Logout</Button> :
            <div>
              <Button onClick={ () => setOpenSignIn(true) }>Sign in</Button>
              <Button onClick={ () => setOpenModal(true) }>Sign up</Button>
            </div>
          }
        </div>
      </div>

    <div className='post-wrap'>
      {postsComponents}

      {user?.displayName ? 
      <ImageUpload username={user.displayName}/> :
      <h3>Sorry you needto login to upload</h3>
      }
    </div>

    </div>
  );
}

export default App;
