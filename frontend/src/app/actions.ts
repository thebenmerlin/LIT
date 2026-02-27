"use server";

import { db } from "@/db";
import { cases, savedCases } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

function mapToCaseObject(row: any) {
    return {
        score: row.score,
        metadata: {
            id: row.id,
            title: row.title,
            court: row.court,
            year: row.year,
            sections: row.sections,
            summary: row.summary
        },
        abstract: row.abstract,
        citations: row.citations || []
    };
}

export async function getAllCases() {
    const allCases = await db.select().from(cases).orderBy(desc(cases.score));
    return allCases.map(mapToCaseObject);
}

export async function getSavedCases() {
    const result = await db
        .select({
            caseView: cases,
            savedAt: savedCases.createdAt
        })
        .from(savedCases)
        .innerJoin(cases, eq(savedCases.caseId, cases.id))
        .orderBy(desc(savedCases.createdAt));

    return result.map(r => mapToCaseObject(r.caseView));
}

export async function toggleSavedCase(caseId: string, isSaving: boolean) {
    if (isSaving) {
        await db.insert(savedCases).values({ id: caseId, caseId }).onConflictDoNothing();
    } else {
        await db.delete(savedCases).where(eq(savedCases.caseId, caseId));
    }
}
