import { expect, describe, it, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../../app.js"
import User from "../../models/User.js"

vi.mock("../../models/User.js", () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn()
  }
}))

const createMockUser = ({ id, ...mockUser }) => {
  User.create.mockResolvedValue({ id, ...mockUser })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("POST / register", async () => {
  it("should return 400 if name is missing", async () => {
    const mockUser = {
      email: "test@example.com",
      password: "12345"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("should return 400 if email is missing", async () => {
    const mockUser = {
      name: "test",
      password: "secret"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("should return 400 if password is missing", async () => {
    const mockUser = {
      name: "test",
      email: "test@examplo.com"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("should return 400 if password and confirm password do not match.", async () => {
    const mockUser = {
      name: "test",
      email: "test@email.com",
      password: "12345",
      confirmpassword: "123"
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("should return 409 if email already exists", async () => {
    const mockUser = {
      name: "test",
      email: "test@gmail.com",
      password: "secret",
      confirmpassword: "secret"
    }

    User.findOne.mockResolvedValue({
      email: "test@gmail.com"
    })

    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty("error")
  })

  it("should retund 201 if register a new user", async () => {
    const mockUser = {
      name: "test",
      email: "test@example.com",
      password: "secret",
      confirmpassword: "secret"
    }

    User.findOne.mockResolvedValue(null)

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post("/auth/register").send(mockUser)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ message: "User created successfully." })
  })
})
