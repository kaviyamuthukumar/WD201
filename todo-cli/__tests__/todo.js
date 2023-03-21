/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Test list of items values", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Add overdue item values", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Add due today item values", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Add due later item values", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Mark as complete values", async () => {
    const overdueItems = await db.Todo.overdue();
    const cTodo = overdueItems[0];
    expect(cTodo.completed).toBe(false);
    await db.Todo.markAsComplete(cTodo.id);
    await cTodo.reload();

    expect(cTodo.completed).toBe(true);
  });

  test("Test completed values", async () => {
    const overdueItems = await db.Todo.overdue();
    const cTodo = overdueItems[0];
    expect(cTodo.completed).toBe(true);
    const displayValue = cTodo.displayableString();
    expect(displayValue).toBe(
      `${cTodo.id}. [x] ${cTodo.title} ${cTodo.dueDate}`
    );
  });

  test("Test incomplete values", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const cTodo = dueLaterItems[0];
    expect(cTodo.completed).toBe(false);
    const displayValue = cTodo.displayableString();
    expect(displayValue).toBe(
      `${cTodo.id}. [ ] ${cTodo.title} ${cTodo.dueDate}`
    );
  });

  test("Test incomplete dueToday values", async () => {
    const dueTodayvalues = await db.Todo.dueToday();
    const cTodo = dueTodayvalues[0];
    expect(cTodo.completed).toBe(false);
    const displayValves = cTodo.displayableString();
    expect(displayValves).toBe(`${cTodo.id}. [ ] ${cTodo.title}`);
  });

  test("Test completed dueToday values", async () => {
    const dueTodayvalues = await db.Todo.dueToday();
    const cTodo = dueToday[0];
    expect(cTodo.completed).toBe(false);
    await db.Todo.markAsComplete(cTodo.id);
    await cTodo.reload();
    const displayValves = cTodo.displayableString();
    expect(displayValves).toBe(`${cTodo.id}. [x] ${cTodo.title}`);
  });
});
