const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const port = 3000;

const limite = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'te pasaste socio'
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const randomNumber = Math.floor(Math.random() * 999999);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.static('public'));
const fs = require('fs');
const path = require('path');
const passwordList = fs.readFileSync(path.join(__dirname, 'passwords.txt'), 'utf-8').split('\n').map(line => line.trim()).filter(line => line.length > 0);

const randomFromList = () => {
    const randomIndex = Math.floor(Math.random() * passwordList.length);
    return passwordList[randomIndex];
};

// Crear 4 usuarios con contraseñas aleatorias
const admins = [];
for (let i = 0; i < 4; i++) {
    admins.push({
        username: randomFromList(),
        password: randomFromList()
    });
}

console.log(`Random number: ${randomNumber}`);
admins.forEach((admin, index) => {
    console.log(`User ${index + 1}:`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Password: ${admin.password}`);
});

app.get(`/${randomNumber}`, (req, res) => {
    res.send("The flag is guacamole");
});

app.post('/api/login', limite , (req, res) => {
    const { username, password } = req.body;
    const validAdmin = admins.find(admin => admin.username === username && admin.password === password);

    if (validAdmin) {
        res.json({ success: true, redirectUrl: `/${randomNumber}` });
    } else if (admins.find(admin => admin.username === username)) {
        res.status(401).json({ message: 'Invalid password', success: false });
    } else if (admins.find(admin => admin.password === password)) {
        res.status(401).json({ message: 'Invalid username', success: false });
    } else {
        res.status(401).json({ message: 'Invalid username and password', success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
