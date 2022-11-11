import { redirect, json } from '@remix-run/node';
import { useCatch, useLoaderData, Link } from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {

  const notes = useLoaderData();

  return(
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if(!notes || notes.length === 0) {
    // throw new Response('Could not find any notes!', {
    //   status: 404,
    //   statusText: 'Data Not Found'
    // });
    
    throw json( { message: 'Could not find any notes!' }, 
      {
      status: 404,
      statusText: 'Data Not Found'
      }
    );
  }
  return notes;
  // return new Response(JSON.stringify(notes), {headers: {'Content-Type': 'application/json'}});
  // return json(notes);
}

export async function action({request}) {
  const formData = await request.formData();

  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content')
  // }

  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid Title - must be at least 5 characters' };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()]
}


export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || 'Data not found.';

  return (
    <main>
      <NewNote />
      <p className={'info-message'}>{message}  - notes page </p>
    </main>
  );
}

export function ErrorBoundary({error}) {
  return (
    <main className='error'>
      <h1>Oops! An error at your notes page!</h1>
      <p>{error.message}</p>
      <p>Back to <Link to={'/'}> 'Home' </Link></p>
    </main>
  );
}
