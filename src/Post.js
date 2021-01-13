import React, {useState, useEffect} from 'react'
import firebase from 'firebase'
import Avatar from '@material-ui/core/Avatar'
import './styles/Post.css';
import { db } from './firebase'

function Post(props) {
    const {content, postId, user} = props;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => ({
                        id : doc.id,
                        content : doc.data()
                    })));
                });
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text : comment,
            user : user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt="Semy Sharp" 
                    src={content.avatarUrl}>
                    {content.userName[0]}
                </Avatar>
                <h3>{content.userName}</h3>
            </div>
            <img
                className="post__image"
                src={content.imageUrl}
                alt="post preview"
            />
            <div className='post__comments'>
                <h4>
                    <strong>{content.userName}</strong> {content.caption}
                </h4>
                {comments.map(comment => (
                    <p key={comment.id}>
                        <b>{comment.content.user}</b> {comment.content.text}
                    </p>
                ))}
                </div>
            
            { user &&
                <form className='post__form'>
                    <input
                        type='text'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={ (e) => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className='post__submitBtn'
                        onClick={postComment}
                        type='submit'
                    >
                        Post
                    </button>
                </form>
            }
        </div>
    )
}

export default Post
