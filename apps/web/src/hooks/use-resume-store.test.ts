import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('idb-keyval', () => ({
  get: vi.fn(() => Promise.resolve(null)),
  set: vi.fn(() => Promise.resolve()),
  del: vi.fn(() => Promise.resolve()),
}))

import { useResumeStore } from './use-resume-store'

beforeEach(() => {
  useResumeStore.setState({ userInfo: {}, jobInfo: {}, jobs: [], content: {} })
})

describe('useResumeStore', () => {
  it('adds a job', () => {
    useResumeStore.getState().addJob({ title: 'Engineer' })
    const state = useResumeStore.getState()
    expect(state.jobs).toHaveLength(1)
    expect(state.jobs[0].title).toBe('Engineer')
  })

  it('resets state', () => {
    useResumeStore.getState().setUserInfo({ name: 'Alice' })
    useResumeStore.getState().reset()
    const state = useResumeStore.getState()
    expect(state.userInfo).toEqual({})
    expect(state.jobs).toHaveLength(0)
  })

  it('removes a job by index', () => {
    const store = useResumeStore.getState()
    store.addJob({ title: 'A' })
    store.addJob({ title: 'B' })
    store.removeJob(0)
    expect(store.jobs).toHaveLength(1)
    expect(store.jobs[0].title).toBe('B')
  })

  it('updates user info', () => {
    const store = useResumeStore.getState()
    store.setUserInfo({ name: 'Bob' })
    expect(store.userInfo).toEqual({ name: 'Bob' })
  })
})
