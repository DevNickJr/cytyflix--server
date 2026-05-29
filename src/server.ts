import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    console.log(req)
    res.send("Hello");
});

app.post('/people', (req: Request, res: Response) => {
    const firstName: string = (req.body.firstName || "").trim();
    const lastName: string = (req.body.lastName || "").trim();

    res.json({ firstName, lastName });
});

app.get('/people/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`Records for id: ${id}`);
});

app.listen(port, () => {
    console.log(`Application is running at http://localhost:${port}`);
})