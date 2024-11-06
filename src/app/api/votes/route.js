// app/api/votes/route.js
import { db } from "@/db";
import auth from "../middleware";

async function getExistingVote(userId, postId) {
  const { rows: existingVotes } = await db.query(
    "SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 LIMIT 1",
    [userId, postId]
  );
  return existingVotes?.[0];
}

async function handleVote(userId, postId, newVote) {
  if (!userId) {
    throw new Error("Cannot vote without being logged in");
  }

  const existingVote = await getExistingVote(userId, postId);

  if (existingVote) {
    if (existingVote.vote === newVote) {
      // Remove the existing vote if toggled
      await db.query("DELETE FROM votes WHERE id = $1", [existingVote.id]);
    } else {
      // Update the existing vote
      await db.query("UPDATE votes SET vote = $1 WHERE id = $2", [
        newVote,
        existingVote.id,
      ]);
    }
  } else {
    // Insert a new vote
    await db.query(
      "INSERT INTO votes (user_id, post_id, vote, vote_type) VALUES ($1, $2, $3, 'post')",
      [userId, postId, newVote]
    );
  }
  return { success: true };
}

export async function POST(request) {
  const session = await auth();
  const { postId, newVote } = await request.json();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
    });
  }

  try {
    await handleVote(session.user.id, postId, newVote);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
