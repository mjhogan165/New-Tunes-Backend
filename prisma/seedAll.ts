import { seedUsers } from "./seed";

seedUsers()
  .then(() => {
    console.log("seeded 🌱");
  })
  .catch((e) => {
    console.error("error seeding 🌱");
    console.error(e);
  });
