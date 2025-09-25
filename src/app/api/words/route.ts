import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const [rows] = await pool.query('SELECT * FROM words ORDER BY id DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { term, meaning } = await req.json();
  const [result] = await pool.query('INSERT INTO words (term, meaning) VALUES (?, ?)', [term, meaning]);
  return NextResponse.json({ id: (result as any).insertId, term, meaning });
}
