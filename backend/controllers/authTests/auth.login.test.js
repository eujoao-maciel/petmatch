import { expect, it, describe, beforeEach, vi } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../../app.js'
import User from '../../models/User.js'

vi.mock('../../models/User.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
  },
}))

const createMockUser = ({ id, ...mockUser }) => {
  User.create.mockResolvedValue({ id, ...mockUser })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST / login', async () => {
  it('should return 400 if email is missing', async () => {
    const mockUser = {
      email: '',
      password: 'secret',
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post('/auth/login').send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 400 if password is missing', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: '',
    }

    createMockUser({ id: 1, ...mockUser })
    const res = await request(app).post('/auth/login').send(mockUser)

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it("should return 404 if user doesn't exist", async () => {
    const mockUser = {
      email: 'test@example.com',
      password: '12345',
    }

    User.findOne.mockResolvedValue(null)
    const res = await request(app).post('/auth/login').send(mockUser)

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it("should return 401 if password doesn't match", async () => {
    const mockUser = {
        email: "test@example.com",
        password: "12345"
    }

    User.findOne.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "12345"
    })

    bcrypt.compare.mockResolvedValue(false)

    const res = await request(app).post("/auth/login").send(mockUser)

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty("error")
  })

  it('should return 200 if login a user', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: '12345',
    }

    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: '12345',
    })

    bcrypt.compare.mockResolvedValue(true)

    const res = await request(app).post('/auth/login').send(mockUser)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
