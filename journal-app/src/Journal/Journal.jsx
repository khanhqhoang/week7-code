import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import db from '../db';
import { Link } from 'react-router-dom';
import AddJournal from './AddJournal';
import firebase from 'firebase/compat/app';

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            console.log(user);
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // const getData = async () => {
        //     const querySnapshot = await getDocs(
        //         collection(db, 'journalEntries')
        //     );
        // };

        // getData();
        // getDocs(
        //     collection(db, 'journalEntries')
        // ).then(
        //     snapshot => {
        //         // snapshot.forEach(doc => {
        //         //     console.log(
        //         //         doc.id, doc.data()
        //         //     );
        //         // });
        //         setEntries(snapshot.docs);
        //         setLoading(false);
        //     },
        //     reason => {
        //         setError(true);
        //         setLoading(false);
        //     }
        // );
        if (!user) {
            return;
        }

        const entriesQuery = query(
            collection(db, 'users', user.uid, 'journalEntries'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(
            entriesQuery,
            snapshot => {
                setEntries(snapshot.docs);
                setLoading(false);
            },
            reason => {
                console.log(reason);
                setError(true);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    if (error) {
        return <p>An error occurred, please try again.</p>
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Journal</h1>
            <AddJournal />
            {entries.map(entry => {
                return (
                    <div key={entry.id}>
                        <p>{entry.data().entry}</p>
                        <span>
                            <Link to={`/journal/${entry.id}`}>View</Link>
                        </span>
                        <hr />
                    </div>
                );
            })}
        </div>
    );
}
