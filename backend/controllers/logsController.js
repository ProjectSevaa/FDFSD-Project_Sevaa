import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "log");

export const getLogs = async (req, res) => {
    try {
        const { type = "all", username = "all", hours = 24 } = req.query;

        const targetDir =
            type === "all"
                ? logDir
                : username === "all"
                ? path.join(logDir, type)
                : path.join(logDir, type, `${username}.log`);

        const logData = {};
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

        if (username === "all") {
            const userFiles = await fs.readdir(targetDir);
            for (const file of userFiles) {
                if (file.endsWith(".log")) {
                    const filePath = path.join(targetDir, file);
                    const content = await fs.readFile(filePath, "utf-8");
                    const lines = content.split("\n").filter(Boolean);

                    const recentLogs = lines.filter((line) => {
                        const timestampMatch = line.match(/\[(.*?)\]/);
                        if (!timestampMatch) return false;

                        const timestamp = new Date(timestampMatch[1]);
                        return timestamp > cutoff;
                    });

                    if (recentLogs.length > 0) {
                        logData[file.replace(".log", "")] = recentLogs;
                    }
                }
            }
        } else {
            const content = await fs.readFile(targetDir, "utf-8");
            const lines = content.split("\n").filter(Boolean);

            const recentLogs = lines.filter((line) => {
                const timestampMatch = line.match(/\[(.*?)\]/);
                if (!timestampMatch) return false;

                const timestamp = new Date(timestampMatch[1]);
                return timestamp > cutoff;
            });

            if (recentLogs.length > 0) {
                logData[username] = recentLogs;
            }
        }

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
