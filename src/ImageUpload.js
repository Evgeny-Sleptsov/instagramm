import React, {useState} from 'react'
import firebase from 'firebase'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import './styles/ImageUpload.css'

export default function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handlerChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handlerUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // progress function...
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function...
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then( url => {
                        // post img inside db
                        db.collection('posts').add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            userName : username
                        })
                    });
                setProgress(0);
                setCaption('');
                setImage(null); 
            }
        )
    }

    return (
        <div className='imageUpload'>
            <progress value={progress} max='100'></progress>
            <input type='text' placeholder='Enter a caption' onChange={ event => setCaption(event.target.value)} value={caption}/>
            <input type='file' onChange={handlerChange}/>
            <Button 
                disabled={!caption || !image}
                onClick={handlerUpload} >
                Upload
            </Button>
        </div>
    )
}