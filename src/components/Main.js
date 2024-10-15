import React, { useState, useEffect } from 'react';
import Dexie from "dexie";
import "./main.css";
import Music from './music';

const Main = () => {
    const db = new Dexie("ReactDexie");
    // create the database store
    db.version(1).stores({
        posts: "title, file"
    });
    db.open().catch((err) => {
        console.log(err.stack || err);
    });

    // state for form input
    const [postTitle, setTitle] = useState("");
    const [postMusicFile, setMusicFile] = useState("");
    // state for all posts
    const [posts, setPosts] = useState([]);
    // state for the current playing song
    const [currentSong, setCurrentSong] = useState({ title: "", file: "" });

    // handle file input and convert it to base64
    const getFile = (e) => {
        let reader = new FileReader();
        reader.readAsDataURL(e[0]);
        reader.onload = (e) => {
            setMusicFile(reader.result);
        };
    };

    // handle deleting a post
    const deletePost = async (id) => {
        db.posts.delete(id);
        let allPosts = await db.posts.toArray();
        setPosts(allPosts);
    };

    // handle form submission
    const getsubmitInfo = (e) => {
        e.preventDefault();
        if (postTitle !== "" && postMusicFile !== "") {
            let post = {
                title: postTitle,
                file: postMusicFile
            };

            db.posts.add(post).then(async () => {
                // retrieve all posts from the database
                let allPosts = await db.posts.toArray();
                setPosts(allPosts);
            });
        }
    };

    // fetch posts on component mount
    useEffect(() => {
        const getPosts = async () => {
            let allPosts = await db.posts.toArray();
            setPosts(allPosts);
        };
        getPosts();
    }, []);

    return (
        <>
            <h1 className="text-center" style={{ marginTop: '50px', margin: '35px 0px' }}>IOT Ready</h1>
            
            <div className="container">
                {/* Form to upload songs */}
                <form onSubmit={getsubmitInfo} className="song-form">
                    <div className="mb-3">
                        <label className="form-label">Name of Audio</label>
                        <input type="text" name="title" className="form-control" onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="cover">Choose an Audio file :</label>
                        </div>
                        <div className="col-auto">
                            <input type="file" id="cover" name="file" className="form-control" onChange={e => getFile(e.target.files)} />
                        </div>
                    </div>
                    <button type="submit" value="Submit" className="btn btn-primary submit">Post</button>
                </form>

                <div className="music-library">
                    {/* Sidebar - Song List */}
                    <div className="sidebar">
                        <h3>Music Library</h3>
                        <ul className="song-list">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <li key={post.title} className="song-item">
                                        <span className="song-title" onClick={() => setCurrentSong({ title: post.title, file: post.file })}>
                                            {post.title}
                                        </span>
                                        <button className="btn btn-danger delete" onClick={() => deletePost(post.title)}>Delete</button>
                                    </li>
                                ))
                            ) : (
                                <p>No songs in the library.</p>
                            )}
                        </ul>
                    </div>

                    {/* Main Music Player */}
                    <div className="main-player">
                        {currentSong.file ? (
                            <Music title={currentSong.title} file={currentSong.file} />
                        ) : (
                            <p className="text-center" style={{ marginTop: '20px' }}>Select a song to play</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;
