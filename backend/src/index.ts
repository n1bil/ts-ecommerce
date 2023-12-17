import cors from "cors";
import express, { Request, Response } from "express";
import { sampleProducts } from "./data";

const app = express();
const PORT = 4000;

app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));




app.get("/api/products", (req: Request, res: Response) => {
    res.json(sampleProducts);
});



app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
