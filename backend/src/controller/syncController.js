import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to run a python script
const runPythonScript = (modulePath, args = []) => {
    return new Promise((resolve, reject) => {
        // Assuming python is in PATH. If not, might need full path or 'python3'
        const pythonProcess = spawn('python', ['-m', modulePath, ...args], {
            cwd: path.join(__dirname, '../../../'), // Go up to root (AarohanCredit)
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' } // Inherit env and set encoding
        });

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            const str = data.toString();
            output += str;
            console.log(`[Python stdout]: ${str}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            const str = data.toString();
            errorOutput += str;
            console.error(`[Python stderr]: ${str}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Python script exited with code ${code}. Error: ${errorOutput}`));
            }
        });
    });
};

export const startSync = async (req, res) => {
    try {
        console.log("Starting sync process...");

        // 1. Run seed_db to reset/populate data
        console.log("Running seed_db...");
        await runPythonScript('agents_platform.scripts.seed_db');
        console.log("seed_db completed.");

        // 2. Run run_end_to_end to perform analysis
        console.log("Running run_end_to_end...");
        const analysisOutput = await runPythonScript('agents_platform.examples.run_end_to_end');
        console.log("run_end_to_end completed.");

        // Extract Report ID if possible, or just return success
        // The python script prints "Report ID: <uuid>"
        const reportIdMatch = analysisOutput.match(/Report ID: ([a-f0-9\-]+)/);
        const reportId = reportIdMatch ? reportIdMatch[1] : null;

        res.status(200).json({
            success: true,
            message: "Sync and analysis completed successfully.",
            reportId: reportId
        });

    } catch (error) {
        console.error("Sync failed:", error);
        res.status(500).json({
            success: false,
            message: "Sync process failed.",
            error: error.message
        });
    }
};
