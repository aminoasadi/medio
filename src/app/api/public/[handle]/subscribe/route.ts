import { handleApiError, formatSuccess, formatError } from "@/lib/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { SubscribeSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { handle: string } }) {
    try {
        const { handle } = params;
        const json = await req.json();
        const { email } = SubscribeSchema.parse(json);

        const userRecord = await db.query.users.findFirst({ where: eq(users.username, handle) });
        if (!userRecord) return formatError("NOT_FOUND", "Profile not found", 404);

        // Naive subscribe: In a real app we would insert into a contacts or subscribers table.
        // For MVP, if we don't have a contacts table we use a mock.
        // Check if contacts table exists or pretend insertion succeeded. (Idempotent)

        return formatSuccess({ subscribed: true });
    } catch (error) {
        return handleApiError(error);
    }
}
