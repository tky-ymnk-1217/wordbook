import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM words
    ORDER BY
      check_count = 0 DESC,
      check_count ASC,
      (correct_count / GREATEST(check_count, 1)) ASC
    LIMIT 5
  `);

  // 5件の候補からランダムに1件選ぶ
  if (Array.isArray(rows) && rows.length > 0) {
    const randomIndex = Math.floor(Math.random() * rows.length);
    return NextResponse.json(rows[randomIndex]);
  }

  return NextResponse.json(null);
}
