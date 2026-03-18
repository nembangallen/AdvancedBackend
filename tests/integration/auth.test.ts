import request from "supertest";
import { app } from "../../src/app";

describe("Auth API", () => {
  it("register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "user2@test.com",
      password: "Password123@",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.userId).toBeDefined();
  });

  it("login successfully with correct credentials", async () => {
    await request(app).post("/auth/register").send({
      email: "user2@test.com",
      password: "Password123@",
    });

    const res = await request(app).post("/auth/login").send({
      email: "user2@test.com",
      password: "Password123@",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged in successfully");
    expect(res.body.accessToken).toBeDefined();
  });

  it("fails to login with incorrect password", async () => {
    await request(app).post("/auth/register").send({
      email: "user3@test.com",
      password: "Password123@",
    });

    const res = await request(app).post("/auth/login").send({
      email: "user3@test.com",
      password: "WrongPassword123@",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
