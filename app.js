const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
const databasePath = path.join(__dirname, "todoApplication.db");
const toDate = require("date-fns/toDate");
const app = express();

app.use(express.json());

let db = null;
module.exports = app;
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const isStatusOnly = (obj) => {
  if (
    obj.priority === undefined &&
    obj.category === undefined &&
    obj.dueDate === undefined &&
    obj.status !== undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isTodoOnly = (obj) => {
  if (
    obj.priority === undefined &&
    obj.category === undefined &&
    obj.dueDate === undefined &&
    obj.status === undefined &&
    obj.todo !== undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isPriorityOnly = (obj) => {
  if (
    obj.priority !== undefined &&
    obj.category === undefined &&
    obj.dueDate === undefined &&
    obj.status === undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isPriorityAndStatus = (obj) => {
  if (
    obj.priority !== undefined &&
    obj.category === undefined &&
    obj.dueDate === undefined &&
    obj.status !== undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isCatAndStatus = (obj) => {
  if (
    obj.priority === undefined &&
    obj.category !== undefined &&
    obj.dueDate === undefined &&
    obj.status !== undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isCatOnly = (obj) => {
  if (
    obj.priority === undefined &&
    obj.category !== undefined &&
    obj.dueDate === undefined &&
    obj.status === undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const isCatAndPriority = (obj) => {
  if (
    obj.priority !== undefined &&
    obj.category !== undefined &&
    obj.dueDate === undefined &&
    obj.status === undefined
  ) {
    return true;
  } else {
    return false;
  }
};
const checkStatus = (status) => {
  if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
    return true;
  } else {
    return false;
  }
};
const checkPriority = (priority) => {
  if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
    return true;
  } else {
    return false;
  }
};
const checkCat = (category) => {
  if (category === "WORK" || category === "HOME" || category === "LEARNING") {
    return true;
  } else {
    return false;
  }
};
const checkDate = (request, response, next) => {
  const { date } = request.query;
  try {
    const newDate = format(new Date(date), "yyyy-MM-dd");

    request.due = newDate;
    next();
  } catch (error) {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

app.get("/todos/", async (request, response) => {
  const { status, priority, category, due_date, search_q = "" } = request.query;
  if (isStatusOnly(request.query)) {
    if (checkStatus(status)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
status='${status}' and todo LIKE '%${search_q}%';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (isPriorityOnly(request.query)) {
    if (checkPriority(priority)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
priority='${priority}' and todo LIKE '%${search_q}%';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (isPriorityAndStatus(request.query)) {
    if (checkPriority(priority) && checkStatus(status)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
priority='${priority}' and status='${status}';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (isCatAndStatus(request.query)) {
    if (checkStatus(status) && checkCat(category)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
category='${category}' and status='${status}';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (isCatOnly(request.query)) {
    if (checkCat(category)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
category='${category}';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (isCatAndPriority(request.query)) {
    if (checkPriority(priority) && checkCat(category)) {
      const getTodo = `
SELECT
*
FROM
todo
WHERE
priority='${priority}' and category='${category}';`;
      const todosArray = await db.all(getTodo);
      response.send(
        todosArray.map((obj) => ({
          id: obj.id,
          todo: obj.todo,
          priority: obj.priority,
          status: obj.status,
          category: obj.category,
          dueDate: obj.due_date,
        }))
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    const getTodo = `
SELECT
*
FROM
todo
WHERE
todo LIKE '%${search_q}%';`;
    const todosArray = await db.all(getTodo);
    response.send(
      todosArray.map((obj) => ({
        id: obj.id,
        todo: obj.todo,
        priority: obj.priority,
        status: obj.status,
        category: obj.category,
        dueDate: obj.due_date,
      }))
    );
  }
});
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodo = `
SELECT
*
FROM
todo
WHERE
id=${todoId};`;
  const obj = await db.get(getTodo);
  response.send({
    id: obj.id,
    todo: obj.todo,
    priority: obj.priority,
    status: obj.status,
    category: obj.category,
    dueDate: obj.due_date,
  });
});
app.get("/agenda/", checkDate, async (request, response) => {
  const { date } = request.query;
  const { due } = request;
  const getTodo = `
        SELECT
        *
        FROM
        todo
        WHERE
        due_date='${due}';`;
  const todosArray = await db.all(getTodo);
  response.send(
    todosArray.map((obj) => ({
      id: obj.id,
      todo: obj.todo,
      priority: obj.priority,
      status: obj.status,
      category: obj.category,
      dueDate: obj.due_date,
    }))
  );
});
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  if (!checkStatus(status)) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (!checkPriority(priority)) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (!checkCat(category)) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (!isValid(new Date(dueDate))) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    const newDate = format(new Date(dueDate), "yyyy-MM-dd");
    const addTodo = `
    INSERT INTO
    todo (id,todo,priority,status,category,due_date)
    VALUES(
        ${id},
        '${todo}',
        '${priority}',
        '${status}',
        '${category}',
        '${newDate}'
    );`;
    await db.run(addTodo);
    response.send("Todo Successfully Added");
  }
});
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, category, todo, dueDate } = request.body;
  if (isStatusOnly(request.body)) {
    if (checkStatus(status)) {
      const updateTodo = `
            UPDATE
            todo
            SET
            status='${status}'
            WHERE
            id=${todoId};
            `;
      await db.run(updateTodo);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (isPriorityOnly(request.body)) {
    if (checkPriority(priority)) {
      const updateTodo = `
            UPDATE
            todo
            SET
            priority='${priority}'
            WHERE
            id=${todoId};
            `;
      await db.run(updateTodo);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (isCatOnly(request.body)) {
    if (checkCat(category)) {
      const updateTodo = `
            UPDATE
            todo
            SET
            category='${category}'
            WHERE
            id=${todoId};
            `;
      await db.run(updateTodo);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (isTodoOnly(request.body)) {
    const updateTodo = `
            UPDATE
            todo
            SET
            todo='${todo}'
            WHERE
            id=${todoId};
            `;
    await db.run(updateTodo);
    response.send("Todo Updated");
  } else {
    if (isValid(new Date(dueDate))) {
      const newDate = format(new Date(dueDate), "yyyy-MM-dd");
      const updateTodo = `
            UPDATE
            todo
            SET
            due_date='${newDate}'
            WHERE
            id=${todoId};
            `;
      await db.run(updateTodo);
      response.send("Due Date Updated");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `
    DELETE
    FROM
    todo
    WHERE
    id=${todoId};`;
  await db.run(deleteTodo);
  response.send("Todo Deleted");
});
