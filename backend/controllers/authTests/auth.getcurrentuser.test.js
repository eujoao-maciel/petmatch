import { expect, it, describe, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../app.js'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import checkAuth from '../../utils/checkAuth.js'

vi.mock('../../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
  },
}))

vi.mock('../../utils/checkAuth.js', () => ({
  default: vi.fn((req, res, next) => {
    req.user = {
      id: 1,
      name: 'testName',
      email: 'test@example.com',
    }
    next()
  }),
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(() => ({ id: 1 })),
  },
}))

const mockUser = {
  id: 1,
  name: 'testName',
  email: 'test@example.com',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET / getcurrentuser', async () => {
  it("should return the current user's data with a 200 status", async () => {
    User.findOne.mockResolvedValue(mockUser)

    const res = await request(app)
      .get('/auth/profile')
      .set('Authorization', 'Bearer mocktoken')

    expect(res.status).toBe(200)
  })
})
