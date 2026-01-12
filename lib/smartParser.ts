import * as chrono from 'chrono-node';

interface SmartTaskData {
    title: string;
    description?: string;
    dueDate?: number;
}

export function parseTaskInput(input: string): SmartTaskData {
    if (!input.trim()) return { title: '' };

    // 1. Extract Date
    const parsedResults = chrono.parse(input);
    let dueDate: number | undefined = undefined;

    // Create a version of text with the date removed for cleaner description
    let cleanText = input;

    if (parsedResults.length > 0) {
        // Take the first date found
        const result = parsedResults[0];
        dueDate = result.start.date().getTime();

        // Remove the date string from the text
        // We replace it with nothing, but we need to be careful with spacing
        cleanText = input.slice(0, result.index) + input.slice(result.index + result.text.length);
    }

    // 2. Split Lines
    // Normalize newlines and trim extra spaces
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) return { title: '' };

    const title = lines[0]; // First line is always title
    const description = lines.slice(1).join('\n').trim(); // Rest are instructions

    return {
        title,
        description: description || undefined,
        dueDate
    };
}
