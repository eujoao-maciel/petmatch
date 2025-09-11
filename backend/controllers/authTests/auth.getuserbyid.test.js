import { expect, describe, vi, beforeEach, it } from 'vitest'
import request from 'supertest'
import app from '../../app.js'
import User from '../../models/User.js'

vi.mock('../../models/User.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET / getuserbyid', async () => {
  it("should return 404 if user doesn't exist", async () => {
    const id = 1

    User.findOne.mockResolvedValue(null)
    const res = await request(app).get(`/auth/${id}`)

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('should return 200 if the user is found', async () => {
    const id = 1
    const mockUser = {
      id: 1,
      email: 'test@gmail.com',
      password: '12345',
    }

    User.findOne.mockResolvedValue(mockUser)
    const res = await request(app).get(`/auth/${id}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('user')
  })
})
