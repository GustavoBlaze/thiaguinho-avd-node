const express = require("express");
const app = express();

app.use(express.json());

// A
const tests = [
  {
    id: 1,
    day: "Segunda-feira",
    dateOfAvd: "01/03/2021",
    subject: "Matemática",
    hour: "08:00",
    teacher: "Samantha",
  },
  {
    id: 2,
    day: "Terça-feira",
    dateOfAvd: "02/03/2021",
    subject: "Português",
    hour: "09:00",
    teacher: "Ana",
  },
];

const middleware = {
  checkIfTestExist(req, res, next) {
    const exist = tests.some((test) => test.id == req.params.id);

    if (exist) return next();
    else {
      res.status(404).json({ error: "Não existe data da prova com este id." });
      return;
    }
  },
};

// B
app.get("/tests", (req, res) => {
  res.json(tests);
});

// C
app.get("/tests/:id", middleware.checkIfTestExist, (req, res) => {
  const test = tests.find(({ id }) => id == req.params.id);

  res.json(test);
});

// D
app.post("/tests", (req, res) => {
  const data = req.body;

  if (!data) {
    res.status(404).json({ error: "Verifique seus dados" });
    return;
  }

  const { day, dateOfAvd, subject, hour, teacher } = data;

  if (!day || !dateOfAvd || !subject || !hour || !teacher) {
    res.status(404).json({
      error:
        "O campo dia da semana ou data da avd ou disciplina ou horário ou professor não existe no corpo da requisição. ",
    });
    return;
  }

  const lastTest = tests[tests.length - 1];

  const id = lastTest.id + 1;

  const newTest = {
    id,
    day,
    dateOfAvd,
    subject,
    hour,
    teacher,
  };

  tests.push(newTest);

  res.json(newTest);
});

// E
app.put("/tests/:id", middleware.checkIfTestExist, (req, res) => {
  const testIndex = tests.findIndex(({ id }) => id == req.params.id);

  const data = req.body;

  if (!data) {
    res.status(404).json({
      error: "Verifique seus dados",
    });

    return;
  }

  const { day, dateOfAvd, subject, hour, teacher } = data;

  if (!day || !dateOfAvd || !subject || !hour || !teacher) {
    res.status(404).json({
      error:
        "O campo dia da semana ou data da avd ou disciplina ou horário ou professor não existe no corpo da requisição. ",
    });
    return;
  }

  Object.assign(tests[testIndex], { day, dateOfAvd, subject, hour, teacher });

  res.json(tests[testIndex]);
});

// F
app.delete("/tests/:id", middleware.checkIfTestExist, (req, res) => {
  const testIndex = tests.findIndex(({ id }) => id == req.params.id);

  console.log(`Deletando prova ${req.params.id}`);
  console.log(tests[testIndex]);

  tests.splice(testIndex, 1);

  res.status(200).json({});
});

// G
app.get("/tests-by-teacher/:teacher", (req, res) => {
  const testsByTeacher = tests
    .filter((test) => test.teacher === req.params.teacher)
    .map(({ day, dateOfAvd, hour, teacher }) => ({
      day,
      dateOfAvd,
      hour,
      teacher,
    }));

  if (testsByTeacher.length === 0) {
    res
      .status(404)
      .json({ error: "Não existe data da avd para este professor. " });
    return;
  }

  res.json(testsByTeacher);
});

// H
app.get("/tests-by-subject/:subject", (req, res) => {
  const test = tests.find(test => test.subject === req.params.subject);

  if (!test) {
    res.status(404).json({
      error: 'Não existe data da avd para esta disciplina.'
    })
  }

  res.json({
    day: test.day,
    dateOfAvd: test.dateOfAvd,
    hour: test.hour,
    teacher: test.teacher
  })
});

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});
