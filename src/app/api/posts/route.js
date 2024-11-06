import { db } from "@/db"; // Database connection
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const sortBy = searchParams.get("sortBy") || "top";

  const sortQuery = {
    recent: "created_at DESC",
    top: "vote_total DESC",
    controversial: "(ABS(SUM(votes.vote))) DESC",
  }[sortBy];

  try {
    const { rows } = await db.query(
      `
      SELECT posts.id, posts.title, posts.body, posts.created_at, users.name,
      COALESCE(SUM(votes.vote), 0) AS vote_total
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN votes ON votes.post_id = posts.id
      GROUP BY posts.id, users.name
      ORDER BY ${sortQuery} 
      LIMIT 10 OFFSET $1`,
      [(page - 1) * 10]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
