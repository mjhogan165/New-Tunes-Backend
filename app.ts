import express from "express";
import { prisma } from "./prisma/prisma-instance";
import { z } from "zod";
// import { customErrorMap } from "./functions";

const createUserSchema = z
  .object({
    createUserName: z.string({
      invalid_type_error: "Invalid UserName",
      required_error: "Username is required",
    }),
    createPassword: z.string().optional(),
    confirmPassword: z.string(),
  })
  .strict();
// z.setErrorMap(customErrorMap);
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.get("/", (_req, res) => {
  res.json({ message: "Hellooooo World!!!" }).status(200); // the 'status' is unnecessary but wanted to show you how to define a status
});
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).send(users);
  console.log("got");
});
app.get("/friendRequests", async (req, res) => {
  const friendRequest = await prisma.friendRequest.findMany();
  res.status(200).send(friendRequest);
  console.log("got");
});
app.get("/newTunes", async (req, res) => {
  const tunes = await prisma.newTune.findMany();
  res.status(200).send(tunes);
});

app.post("/users", async (req, res) => {
  const body = createUserSchema.safeParse(req.body);
  console.log({ BODY: req.body });
  if (!body.success) {
    // const errMsg = customErrorMap()
    console.log(body.error.issues[0].message);
    return res.status(404).send({ message: body.error.issues[0].message });
  }
  const users = await prisma.user.create({
    data: {
      username: body.data.createUserName,
      password: body.data.createPassword,
    },
  });
  res.status(200).send(users);
});
app.listen(3001);
///4444
