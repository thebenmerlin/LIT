import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { cases } from "./schema";
import { MOCK_DATA } from "../app/mockData";

async function main() {
    // Dynamically import db so dotenv has time to populate process.env
    const { db } = await import("./index");

    console.log("Seeding database...");
    for (const item of MOCK_DATA) {
        await db.insert(cases).values({
            id: item.metadata.id,
            score: item.score,
            title: item.metadata.title,
            court: item.metadata.court,
            year: item.metadata.year,
            sections: item.metadata.sections,
            summary: item.metadata.summary,
            abstract: item.abstract,
            citations: item.citations || [],
        }).onConflictDoNothing();
    }
    console.log("Seeding complete!");
    process.exit(0);
}

main().catch(e => {
    console.error("Error seeding DB:", e);
    process.exit(1);
});
