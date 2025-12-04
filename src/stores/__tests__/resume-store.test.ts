import { act, renderHook } from "@testing-library/react";
import type { JobInfo, ResumeDocument, UserInfo } from "../resume-store";
import { useResumeStore } from "../resume-store";

describe("useResumeStore", () => {
  beforeEach(() => {
    // Clear store state before each test
    useResumeStore.setState({
      userInfo: {},
      jobInfo: {},
      jobs: [],
      documents: [],
      content: {},
    });
  });

  afterEach(async () => {
    // Clear IndexedDB after each test
    const { del } = await import("idb-keyval");
    await del("resumier-resume-store");
  });

  describe("Initial State", () => {
    it("should have empty initial state", () => {
      const { result } = renderHook(() => useResumeStore());
      expect(result.current.userInfo).toEqual({});
      expect(result.current.jobInfo).toEqual({});
      expect(result.current.jobs).toEqual([]);
      expect(result.current.documents).toEqual([]);
      expect(result.current.content).toEqual({});
    });
  });

  describe("User Info Actions", () => {
    it("should set user info", () => {
      const { result } = renderHook(() => useResumeStore());
      const userInfo: UserInfo = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
      };

      act(() => {
        result.current.setUserInfo(userInfo);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.userInfo).toEqual(userInfo);
    });

    it("should update user info partially", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setUserInfo({
          name: "John Doe",
          email: "john@example.com",
        });
      });

      act(() => {
        result.current.updateUserInfo({ phone: "123-456-7890" });
      });

      const currentState = useResumeStore.getState();
      expect(currentState.userInfo).toEqual({
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
      });
    });

    it("should reset user info", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setUserInfo({ name: "John Doe" });
      });

      act(() => {
        result.current.resetUserInfo();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.userInfo).toEqual({});
    });
  });

  describe("Job Info Actions", () => {
    it("should set job info", () => {
      const { result } = renderHook(() => useResumeStore());
      const jobInfo: JobInfo = {
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco",
      };

      act(() => {
        result.current.setJobInfo(jobInfo);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobInfo).toEqual(jobInfo);
    });

    it("should update job info partially", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setJobInfo({ title: "Engineer", company: "Tech" });
      });

      act(() => {
        result.current.updateJobInfo({ location: "NYC" });
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobInfo).toEqual({
        title: "Engineer",
        company: "Tech",
        location: "NYC",
      });
    });

    it("should reset job info", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setJobInfo({ title: "Engineer" });
      });

      act(() => {
        result.current.resetJobInfo();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobInfo).toEqual({});
    });
  });

  describe("Jobs List Actions", () => {
    it("should add a job", () => {
      const { result } = renderHook(() => useResumeStore());
      const job: JobInfo = { title: "Engineer", company: "Tech" };

      act(() => {
        result.current.addJob(job);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobs).toHaveLength(1);
      expect(currentState.jobs[0]).toEqual(job);
    });

    it("should update a job", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addJob({ title: "Engineer" });
      });

      act(() => {
        result.current.updateJob(0, { company: "Tech Corp" });
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobs[0]).toEqual({
        title: "Engineer",
        company: "Tech Corp",
      });
    });

    it("should remove a job", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addJob({ title: "Job 1" });
        result.current.addJob({ title: "Job 2" });
      });

      act(() => {
        result.current.removeJob(0);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobs).toHaveLength(1);
      expect(currentState.jobs[0].title).toBe("Job 2");
    });

    it("should clear all jobs", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addJob({ title: "Job 1" });
        result.current.addJob({ title: "Job 2" });
      });

      act(() => {
        result.current.clearJobs();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.jobs).toEqual([]);
    });
  });

  describe("Documents Actions", () => {
    it("should add a document with timestamp", () => {
      const { result } = renderHook(() => useResumeStore());
      const doc: ResumeDocument = { id: "1", name: "My Resume" };

      act(() => {
        result.current.addDocument(doc);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.documents).toHaveLength(1);
      expect(currentState.documents[0].id).toBe("1");
      expect(currentState.documents[0].name).toBe("My Resume");
      expect(currentState.documents[0].createdAt).toBeDefined();
    });

    it("should update a document with updatedAt timestamp", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addDocument({ id: "1", name: "Resume" });
      });

      act(() => {
        result.current.updateDocument("1", { name: "Updated Resume" });
      });

      const currentState = useResumeStore.getState();
      expect(currentState.documents[0].name).toBe("Updated Resume");
      expect(currentState.documents[0].updatedAt).toBeDefined();
    });

    it("should remove a document", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addDocument({ id: "1", name: "Doc 1" });
        result.current.addDocument({ id: "2", name: "Doc 2" });
      });

      act(() => {
        result.current.removeDocument("1");
      });

      const currentState = useResumeStore.getState();
      expect(currentState.documents).toHaveLength(1);
      expect(currentState.documents[0].id).toBe("2");
    });

    it("should clear all documents", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.addDocument({ id: "1", name: "Doc 1" });
        result.current.addDocument({ id: "2", name: "Doc 2" });
      });

      act(() => {
        result.current.clearDocuments();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.documents).toEqual([]);
    });
  });

  describe("Content Actions", () => {
    it("should set content", () => {
      const { result } = renderHook(() => useResumeStore());
      const content = { section1: "data" };

      act(() => {
        result.current.setContent(content);
      });

      const currentState = useResumeStore.getState();
      expect(currentState.content).toEqual(content);
    });

    it("should update content partially", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setContent({ section1: "data1" });
      });

      act(() => {
        result.current.updateContent({ section2: "data2" });
      });

      const currentState = useResumeStore.getState();
      expect(currentState.content).toEqual({
        section1: "data1",
        section2: "data2",
      });
    });

    it("should reset content", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setContent({ section1: "data" });
      });

      act(() => {
        result.current.resetContent();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.content).toEqual({});
    });
  });

  describe("Global Reset", () => {
    it("should reset all state", () => {
      const { result } = renderHook(() => useResumeStore());

      act(() => {
        result.current.setUserInfo({ name: "John" });
        result.current.setJobInfo({ title: "Engineer" });
        result.current.addJob({ title: "Job 1" });
        result.current.addDocument({ id: "1", name: "Doc" });
        result.current.setContent({ section: "data" });
      });

      act(() => {
        result.current.reset();
      });

      const currentState = useResumeStore.getState();
      expect(currentState.userInfo).toEqual({});
      expect(currentState.jobInfo).toEqual({});
      expect(currentState.jobs).toEqual([]);
      expect(currentState.documents).toEqual([]);
      expect(currentState.content).toEqual({});
    });
  });

  describe("Selectors", () => {
    it("should not cause re-render when unrelated state changes", () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useResumeStore((state) => state.userInfo);
      });

      expect(renderCount).toBe(1);
      expect(result.current).toEqual({});

      // Changing jobInfo shouldn't cause re-render of userInfo selector
      act(() => {
        useResumeStore.getState().setJobInfo({ title: "Engineer" });
      });

      // Still only 1 render since userInfo didn't change
      expect(renderCount).toBe(1);

      // Changing userInfo SHOULD cause re-render
      act(() => {
        useResumeStore.getState().setUserInfo({ name: "John" });
      });

      expect(renderCount).toBe(2);
      expect(result.current).toEqual({ name: "John" });
    });
  });
});
