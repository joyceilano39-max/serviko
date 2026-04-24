import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`CREATE TABLE IF NOT EXISTS expenses (id SERIAL PRIMARY KEY, category VARCHAR(50), description TEXT, amount DECIMAL(10,2), expense_date DATE, created_at TIMESTAMP DEFAULT NOW())`;
    const expenses = await sql`SELECT * FROM expenses ORDER BY expense_date DESC`;
    const total = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE expense_date >= date_trunc('month', CURRENT_DATE)`;
    return NextResponse.json({ expenses, monthlyTotal: parseFloat(total[0].total) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, expenses: [] });
  }
}

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const body = await req.json();
  try {
    await sql`INSERT INTO expenses (category, description, amount, expense_date) VALUES (${body.category}, ${body.description}, ${body.amount}, ${body.expense_date})`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = req.nextUrl.searchParams.get("id");
  try {
    await sql`DELETE FROM expenses WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}