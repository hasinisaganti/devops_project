const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// In-memory store (resets on restart; fine for a demo)
let students = [
  { id: 1, name: 'Asha Rao', email: 'asha@example.com', course: 'Computer Science' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@example.com', course: 'Electronics' }
];
let nextId = 3;

const validate = (body) => {
  const { name, email, course } = body || {};
  if (!name || !email || !course) return 'name, email and course are required';
  return null;
};

app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.get('/students', (req, res) => res.json(students));

app.get('/students/:id', (req, res) => {
  const s = students.find((x) => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ error: 'Student not found' });
  res.json(s);
});

app.post('/students', (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { name, email, course } = req.body;
  const student = { id: nextId++, name, email, course };
  students.push(student);
  res.status(201).json(student);
});

app.put('/students/:id', (req, res) => {
  const s = students.find((x) => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ error: 'Student not found' });
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  Object.assign(s, { name: req.body.name, email: req.body.email, course: req.body.course });
  res.json(s);
});

app.delete('/students/:id', (req, res) => {
  const idx = students.findIndex((x) => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  students.splice(idx, 1);
  res.status(204).send();
});

module.exports = app;
