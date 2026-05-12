import pkg from 'pg';
const { Pool } = pkg;
import { nanoid } from 'nanoid';
import collaborationRepositories from '../../collaborations/repositories/collaboration-repositories.js';

class NoteRepositories {
  constructor() {
    this.pool = new Pool();
    this.collaborationRepositories = collaborationRepositories;
  }

  async createNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const query = {
      text: 'INSERT INTO notes(id, title, body, tags, created_at, "updated_at", owner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, body, tags, created_at, "updated_at"',
      values: [id, title, body, tags, created_at, updated_at, owner],
    };

    const result = await this.pool.query(query);

    return result.rows[0];

  }

  async getAllNotes(owner) {
    const query = {
      text: `
        SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = $1 OR collaborations.user_id = $1
        GROUP BY notes.id`,
      values: [owner],
      // text: 'SELECT * FROM notes WHERE owner = $1',
      // values: [owner],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getNoteById(id) {
    const query = {
      text: `
      SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
      // text: `
      //   SELECT notes.id, notes.title, notes.body, notes.tags, notes.created_at, notes."updated_at", users.username
      //   FROM notes
      //   JOIN users ON notes.owner = users.id
      //   WHERE notes.id = $1
      // `,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editNote({ id, title, body, tags }) {
    const updated_at = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, "updated_at" = $4 WHERE id = $5 RETURNING id, title, body, tags, created_at, "updated_at"',
      values: [title, body, tags, updated_at, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteNote(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return null;
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      return null;
    }

    return result.rows[0];
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      const ownerResult = await this.verifyNoteOwner(noteId, userId);
    
      if (ownerResult) {
        // return ownerResult;
        return true;
      }
    } catch (error) {
      console.log('Bukan owner');
    }
  
    // const result =  await this.collaborationRepositories.verifyCollaborator(noteId, userId);
  
    // return result;
    const collaboratorResult = await this.collaborationRepositories.verifyCollaborator(noteId, userId);

    if (collaboratorResult) {
      // return collaboratorResult;
      return true;
    }

    return false;
  }
}

export default new NoteRepositories();