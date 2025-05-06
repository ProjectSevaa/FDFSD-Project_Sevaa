import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "log");

export const getLogs = async (req, res) => {
    try {
        const { type = "all", username = "all", hours = 24 } = req.query;
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        const logData = {};

        const processLogFile = async (filePath, key) => {
            try {
                const content = await fs.readFile(filePath, "utf-8");
                const lines = content.split("\n").filter(Boolean);

                const recentLogs = lines.filter((line) => {
                    const match = line.match(/\[(.*?)\]/);
                    if (!match) return false;
                    const timestamp = new Date(match[1]);
                    return timestamp > cutoff;
                });

                if (recentLogs.length) {
                    logData[key] = recentLogs;
                }
            } catch (err) {
                console.warn(`Skipping unreadable file: ${filePath}`, err);
            }
        };

        const traverseDirectory = async (dir) => {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    await traverseDirectory(fullPath);
                } else if (entry.isFile() && entry.name.endsWith(".log")) {
                    const relative = path.relative(logDir, fullPath);
                    const [logType, filename] = relative.split(path.sep);
                    const userFromFile = filename?.replace(".log", "");

                    // Apply filters
                    const isMatchingType = type === "all" || logType === type;
                    const isMatchingUser =
                        username === "all" || userFromFile === username;

                    if (isMatchingType && isMatchingUser) {
                        const key = relative.replace(".log", "").replace(/\\/g, "/");
                        await processLogFile(fullPath, key);
                    }
                }
            }
        };

        await traverseDirectory(logDir);

        res.json({ success: true, logs: logData });
    } catch (error) {
        console.error("Error reading logs:", error);
        res.status(500).json({ success: false, message: "Error reading logs" });
    }
};


export const getLogTypes = async (req, res) => {
    try {
        const directories = await fs.readdir(logDir, { withFileTypes: true });
        const types = directories
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        res.json({ success: true, types: ["all", ...types] });
    } catch (error) {
        console.error("Error getting log types:", error);
        res.status(500).json({
            success: false,
            message: "Error getting log types",
        });
    }
};
