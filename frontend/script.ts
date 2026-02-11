let token = "";
const login = async (username: string, password: string) => {
  const response = await fetch("http://localhost:3000/auth/register", {
    body: JSON.stringify({ username, password }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  token = data.data.token;
  await createCategories();
  await add10Expenses();
};
const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Other",
];
const categoriesId: string[] = [];
const add10Expenses = async () => {
  for (let i = 0; i < 100; i++) {
    if (Math.random() > 0.5) {
      await handleAddTxn(i, "EXPENSES");
    } else {
      await handleAddTxn(i, "INCOME");
    }
  }
};

const createCategories = async () => {
  for (const category of categories) {
    const response = await fetch("http://localhost:3000/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: category,
      }),
    });
    const data = await response.json();
    console.log(data.data.category.id);
    categoriesId.push(data.data.category.id);
  }
};
const handleAddTxn = async (id: number, type: string) => {
  const response = await fetch("http://localhost:3000/transactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: type,
      categoryId: categoriesId[Math.floor(Math.random() * categoriesId.length)],
      categoryName: categories[Math.floor(Math.random() * categories.length)],
      description: "this is " + type.toLowerCase() + " " + id,

      date: new Date(
        new Date().getTime() - Math.random() * 40 * 24 * 60 * 60 * 1000,
      ),
      amt: Math.random() * 1000,
    }),
  });
  await response.json();
};

login("username", "password");
