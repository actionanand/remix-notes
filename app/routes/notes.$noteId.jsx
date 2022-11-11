import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import styles from '~/styles/note-details.css';
import { getStoredNotes } from '~/data/notes';

export default function NoteDetailsPage() {

  const note = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes"> Back to all notes </Link>
        </nav>
        <h1> { note.title } </h1>
      </header>
      <p id="note-details-content"> { note.content } </p>
    </main>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export async function loader({params}) {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNotes = notes.find(note => note.id == noteId);

  if(!selectedNotes) {
    throw json(
      {message: 'Could not find the note for the ID: ' + noteId},
      {status: 404}
    );
  }

  return selectedNotes;
}

export function meta({data}) { // data(note) is available as it's returned from loader function
  const title =  data?.title || 'Note Not Found';
  return {
    title,
    description: 'Manage your notes with ease.'
  }
}