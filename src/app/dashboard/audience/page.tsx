import { auth } from "@/auth"
import { db } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AudiencePage() {
    const session = await auth()
    if (!session?.user?.id) return null

    const subscribers = await db
        .select()
        .from(contacts)
        .where(eq(contacts.user_id, session.user.id))
        .orderBy(desc(contacts.created_at))

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Audience CRM</h1>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Subscribed At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subscribers.length > 0 ? (
                            subscribers.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">{contact.email}</TableCell>
                                    <TableCell>{contact.created_at.toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                    No subscribers yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
