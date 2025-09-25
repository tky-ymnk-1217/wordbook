import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { correct } = await req.json();

  await pool.query(
    `UPDATE words SET check_count = check_count + 1, correct_count = correct_count + ? WHERE id = ?`,
    [correct ? 1 : 0, id]
  );

  return NextResponse.json({ success: true });
}
