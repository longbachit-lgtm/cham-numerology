import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.middleware';
import pool from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

const createTodoSchema = z.object({
  text: z.string().min(1),
  dueAt: z.string().datetime().optional(),
  sourceTag: z.string().optional(),
});

const updateTodoSchema = z.object({
  text: z.string().min(1).optional(),
  dueAt: z.string().datetime().nullable().optional(),
  doneAt: z.string().datetime().nullable().optional(),
});

const createReminderSchema = z.object({
  todoId: z.string().uuid(),
  remindAt: z.string().datetime(),
  channel: z.enum(['push', 'email']).default('push'),
});

/**
 * GET /todos
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, text, source_tag, due_at, done_at, created_at, updated_at
       FROM todos
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );
    
    res.json({
      todos: result.rows.map(row => ({
        id: row.id,
        text: row.text,
        sourceTag: row.source_tag,
        dueAt: row.due_at,
        doneAt: row.done_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /todos
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = createTodoSchema.parse(req.body);
    const id = uuidv4();
    
    const result = await pool.query(
      `INSERT INTO todos (id, user_id, text, source_tag, due_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, text, source_tag, due_at, done_at, created_at`,
      [id, req.userId, data.text, data.sourceTag, data.dueAt]
    );
    
    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      text: row.text,
      sourceTag: row.source_tag,
      dueAt: row.due_at,
      doneAt: row.done_at,
      createdAt: row.created_at,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /todos/:id
 */
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateTodoSchema.parse(req.body);
    
    // Check ownership
    const check = await pool.query(
      `SELECT user_id FROM todos WHERE id = $1`,
      [id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (check.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.text !== undefined) {
      updates.push(`text = $${paramIndex++}`);
      values.push(data.text);
    }
    
    if (data.dueAt !== undefined) {
      updates.push(`due_at = $${paramIndex++}`);
      values.push(data.dueAt);
    }
    
    if (data.doneAt !== undefined) {
      updates.push(`done_at = $${paramIndex++}`);
      values.push(data.doneAt);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const result = await pool.query(
      `UPDATE todos SET ${updates.join(', ')}, updated_at = now()
       WHERE id = $${paramIndex}
       RETURNING id, text, source_tag, due_at, done_at, created_at, updated_at`,
      values
    );
    
    const row = result.rows[0];
    res.json({
      id: row.id,
      text: row.text,
      sourceTag: row.source_tag,
      dueAt: row.due_at,
      doneAt: row.done_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /todos/:id
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check ownership
    const check = await pool.query(
      `SELECT user_id FROM todos WHERE id = $1`,
      [id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (check.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /reminders
 */
router.post('/reminders', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = createReminderSchema.parse(req.body);
    const id = uuidv4();
    
    // Check todo ownership
    const check = await pool.query(
      `SELECT user_id FROM todos WHERE id = $1`,
      [data.todoId]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (check.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const result = await pool.query(
      `INSERT INTO reminders (id, user_id, todo_id, remind_at, channel)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, todo_id, remind_at, channel, status, created_at`,
      [id, req.userId, data.todoId, data.remindAt, data.channel]
    );
    
    const row = result.rows[0];
    
    // TODO: Enqueue reminder job to BullMQ
    
    res.status(201).json({
      id: row.id,
      todoId: row.todo_id,
      remindAt: row.remind_at,
      channel: row.channel,
      status: row.status,
      createdAt: row.created_at,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('Create reminder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
