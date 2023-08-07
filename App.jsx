import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, 
         addDoc, 
         doc, 
         deleteDoc,
         setDoc } 
from "firebase/firestore"
import { notesCollection, db } from "./firebase"

export default function App() {
    //empty array to assign notes from Firebase
    const [notes, setNotes] = React.useState([])

    //can no longer use localStorage so must bring in values for 
    //currentNoteId from Firebase. See useEffect below
    const [currentNoteId, setCurrentNoteId] = React.useState("")

    //state to help us with debouncing to Firebase
    const [tempNoteText, setTempNoteText] = React.useState("")
    
    //const for accessing note's id
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    //const for sorting array in order by updatedAt
    const sortedNotes = notes.sort((a,b) => (b.updatedAt - a.updatedAt))

    //This useEffect will load data in state 
    //with data from Firebase w/ onSnapshot when we first start our program
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])

    //this is the useEffect referenced before to set id from id in Firebase
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes]) 

    //debouncing useEffects
    React.useEffect(() => {
        if(currentNote) {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    //The function to add notes into Firebase
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNote.id)
    }

    //function that takes live updates from our programs and pushes it to Firebase
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
    }

    //function that deletes notes in Firestore when it is deleted from local program
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
