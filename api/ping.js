export default async function handler(req, res) {
    try {
        // Perform a lightweight SELECT query on the 'settings' table.
        // This ensures actual Postgres database activity, preventing Supabase from pausing the project.
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: "Missing Supabase environment variables in Vercel." });
        }

        const response = await fetch(
            `${supabaseUrl}/rest/v1/settings?select=id&limit=1`,
            {
                method: "GET",
                headers: {
                    "apikey": supabaseKey,
                    "Authorization": `Bearer ${supabaseKey}`
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        console.log("Ping successful. DB response:", data);

        return res.status(200).json({
            status: "success",
            message: "Database activity generated successfully",
            timestamp: new Date().toISOString(),
            data_received: data.length > 0
        });
    } catch (err) {
        console.error("Cron Ping Error:", err);
        return res.status(500).json({
            status: "error",
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
}