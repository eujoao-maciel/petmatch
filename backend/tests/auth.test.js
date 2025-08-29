import { expect, describe, it, vi } from "vitest"
import request from "supertest"
import app from "../app.js"
import User from "../models/User.js"

vi.mock("../models/User.js", () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn()
  }
}))

const createMockUser = ({ id, ...mockUser }) => {
  User.create.mockResolvedValue({ id, ...mockUser })
}

describe("POST / register", async () => {
  it("Should return 400 if name is missing", async () => {
    const mockUser = {
      email: "test@example.com",
      password: "12345"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
  })

  it("Should return 400 if email is missing", async () => {
    const mockUser = {
      name: "test",
      password: "secret"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
  })

  it("Should return 409 if email already exists", async () => {
    const mockUser = {
      name: "test",
      email: "test@gmail.com",
      password: "secret"
    }

    User.findOne.mockResolvedValue({ id: 1, ...mockUser })

    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(409)

    expect(res.body).toHaveProperty("error")
  })

  it("Should retund 201 if register a new user", async () => {
    const mockUser = {
      name: "test",
      email: "test@example.com",
      password: "secret"
    }

    User.findOne.mockResolvedValue(null)

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ message: "User created successfully." })
  })
})
