import { expect, describe, it, beforeEach, vi } from 'vitest'
import request from 'supertest'
import app from '../../app.js'
import User from '../../models/User.js'
import jwt from 'jsonwebtoken'

vi.mock('../../models/User.js', () => ({
  default: {
    findOne: vi.fn(),
    update: vi.fn(),
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
  },
}))

vi.mock('multer', () => {
  const diskStorageMock = vi.fn(() => ({
    destination: vi.fn(),
    filename: vi.fn(),
  }))

  const singleMock = vi.fn(() => (req, res, next) => {
    req.file = {
      filename: 'mock-image.png',
    }

    next()
  })

  const multerMock = vi.fn(() => ({
    single: singleMock,
  }))

  multerMock.diskStorage = diskStorageMock

  return {
    __esModule: true,
    default: multerMock,
  }
})

const mockUser = {
  id: 1,
  name: 'test',
  email: 'test@example.com',
  phone: '12345',
  profileImage: '',
  save: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  jwt.verify.mockReturnValue({ id: mockUser.id })
  User.findOne.mockResolvedValue(mockUser)
})

describe('PUT / updateUser', async () => {
  it("should update a user's name and return 200 status", async () => {
    const updatedData = { name: 'newName' }

    User.update.mockResolvedValue([1])

    const res = await request(app)
      .put(`/auth/update/${mockUser.id}`)
      .set('Authorization', 'Bearer mocktoken')
      .send(updatedData)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('User updated successfully.')
  })

  it("should update a user's phone and return 200 status", async () => {
    const updatedData = { phone: '12345' }

    User.update.mockResolvedValue([1])

    const res = await request(app)
      .put(`/auth/update/${mockUser.id}`)
      .set('Authorization', 'Bearer mocktoken')
      .send(updatedData)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('User updated successfully.')
  })

  it('should return 500 status on database update failure', async () => {
    User.update.mockRejectedValue(new Error('Simulated database error'))

    const updatedData = { name: 'newName' }

    const res = await request(app)
      .put(`/auth/update/${mockUser.id}`)
      .set('Authorization', 'Bearer mocktoken')
      .send(updatedData)

    expect(res.status).toBe(500)
    expect(res.body.error.type).toBe('Internal error')
    expect(res.body.error.message).toContain('Internal server error: ')
  })

  // I couldn't get the image update test to work yet
})
