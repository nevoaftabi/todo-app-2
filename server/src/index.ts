import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import "./session-types";
import dotenv from 'dotenv';

dotenv.config();

const { PORT, SESSION_SECRET } = process.env;

if(!PORT || !SESSION_SECRET) {
    throw new Error("Environment variables are missing");
}

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));

app.use(session({
    name: "sid",
    secret: SESSION_SECRET!,
    resave: false,
    saveUninitialized: false, 
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));



app.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(email === 'test@test.com' && password === 'test') {
        req.session.user = { id: "123", password: 'test' };
        return res.json({ ok: true })
    }

    res.status(401).json({ ok: false });
});

app.get("/me", (req, res) => {
    if(!req.session.user) return res.status(401).json({ ok: false });
    res.json(req.session.user);
});

app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ message: "You have been logged out"});
    });
});

app.use((_: Request, res: Response) => {
    res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(PORT, () => {
    console.log('App is listening on port 3000');
}) 