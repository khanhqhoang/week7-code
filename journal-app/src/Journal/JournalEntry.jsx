import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import db from '../db';

export default function JournalEntry() {
    const { id: entryId } = useParams();
    const [entry, setEntry] = useState({});
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
        if (!user) {
            return;
        }

        const entryRef = doc(
            db, 'users', user.uid, 'journalEntries', entryId
        );
        getDoc(entryRef).then(docSnap => {
            setLoading(false);

            if (docSnap.exists()) {
                // store in state
                setEntry(docSnap.data());
            } else {
                // show error
                setError(true);
            }
        });
    }, [user, entryId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error, that document may not exist</p>;
    }

    return (
        <div>
            <h1>Journal Entry: {entryId}</h1>
            {entry.entry}
        </div>
    );
}
