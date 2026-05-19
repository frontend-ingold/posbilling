import { app } from "./app.js";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`POS backend running on port ${PORT}`);
});
