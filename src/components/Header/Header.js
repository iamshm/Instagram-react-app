import React, { useState, useEffect } from 'react'
import './Header.css';
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import { auth } from "../../firebase"
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
        backgroundColor: "#000",
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));



function Header() {
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [user, setUser] = useState(null);


    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {

                setUser(authUser);
            } else {
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [user, userName])

    const signUp = (e) => {
        e.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: userName
                })
            })
            .catch((error) => alert(error.message))
        setOpen(false);
    }
    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).then(
            () => {
                setUserName(auth.currentUser.displayName)
            }
        )
            .catch((error) => alert(error.message));


        setOpenSignIn(false);
    }
    return (
        <div className="app-header">
            <img src=
                "https://www.pngkey.com/png/full/1-13459_instagram-font-logo-white-png-instagram-white-text.png"
                alt="logo"
                className="app-header-image" />
            <Modal
                open={open}
                onClose={() => setOpen(false)} >
                <div style={modalStyle} className={classes.paper}>
                    <form className="signup-form">

                        <img src=
                            "https://www.pngkey.com/png/full/1-13459_instagram-font-logo-white-png-instagram-white-text.png"
                            alt="logo"
                            className="form-image" />
                        <Input className='input'
                            placeholder="Username"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)} />
                        <Input className='input'
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <Input className='input'
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <Button className="signup-button-modal" onClick={signUp}>Sign Up</Button>
                    </form>

                </div>
            </Modal>
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)} >
                <div style={modalStyle} className={classes.paper}>
                    <form className="signup-form">

                        <img src=
                            "https://www.pngkey.com/png/full/1-13459_instagram-font-logo-white-png-instagram-white-text.png"
                            alt="logo"
                            className="form-image" />
                        <Input className='input'
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <Input className='input'
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <Button className="signup-button-modal" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            {
                user ? (
                    <div className="app-loggedin">
                        <h4 className="signup-button">
                            {userName}
                        </h4>
                        <Button className="signup-button" onClick={() => auth.signOut()} >Log Out</Button>
                    </div>)
                    :
                    (<div className="app-signin">
                        <Button className="signup-button" onClick={() => setOpen(true)} >Sign Up</Button>
                        <Button className="signup-button" onClick={() => setOpenSignIn(true)} >Log In</Button>
                    </div>)
            }

        </div>
    )
}

export default Header
