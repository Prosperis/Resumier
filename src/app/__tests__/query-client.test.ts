import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "../query-client";

describe("queryClient", () => {
  describe("Instance", () => {
    it("should be a QueryClient instance", () => {
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it("should be a singleton instance", async () => {
      // Import again to verify it's the same instance
      const module = await import("../query-client");
      expect(queryClient).toBe(module.queryClient);
    });
  });

  describe("Query Default Options", () => {
    it("should have stale time set to 5 minutes", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.queries?.staleTime).toBe(1000 * 60 * 5);
    });

    it("should have garbage collection time set to 10 minutes", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.queries?.gcTime).toBe(1000 * 60 * 10);
    });

    it("should have retry set to 3", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.queries?.retry).toBe(3);
    });

    it("should have refetchOnReconnect enabled", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.queries?.refetchOnReconnect).toBe(true);
    });

    it("should configure refetchOnWindowFocus based on environment", () => {
      const options = queryClient.getDefaultOptions();
      // In test environment, import.meta.env.PROD is false
      expect(options.queries?.refetchOnWindowFocus).toBe(import.meta.env.PROD);
    });
  });

  describe("Retry Delay Function", () => {
    it("should have a retry delay function", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.queries?.retryDelay).toBeTypeOf("function");
    });

    it("should calculate exponential backoff correctly", () => {
      const options = queryClient.getDefaultOptions();
      const retryDelay = options.queries?.retryDelay as (
        attemptIndex: number,
      ) => number;

      // First retry: 2^0 * 1000 = 1000ms
      expect(retryDelay(0)).toBe(1000);

      // Second retry: 2^1 * 1000 = 2000ms
      expect(retryDelay(1)).toBe(2000);

      // Third retry: 2^2 * 1000 = 4000ms
      expect(retryDelay(2)).toBe(4000);

      // Fourth retry: 2^3 * 1000 = 8000ms
      expect(retryDelay(3)).toBe(8000);
    });

    it("should cap retry delay at 30 seconds", () => {
      const options = queryClient.getDefaultOptions();
      const retryDelay = options.queries?.retryDelay as (
        attemptIndex: number,
      ) => number;

      // Very large attempt index should still cap at 30000ms
      expect(retryDelay(10)).toBe(30000);
      expect(retryDelay(20)).toBe(30000);
      expect(retryDelay(100)).toBe(30000);
    });
  });

  describe("Mutation Default Options", () => {
    it("should have retry set to 1 for mutations", () => {
      const options = queryClient.getDefaultOptions();
      expect(options.mutations?.retry).toBe(1);
    });
  });

  describe("Cache Management", () => {
    beforeEach(() => {
      // Clear the query cache before each test
      queryClient.clear();
    });

    it("should allow setting query data", () => {
      const testKey = ["test-query"];
      const testData = { id: 1, name: "Test" };

      queryClient.setQueryData(testKey, testData);
      const cachedData = queryClient.getQueryData(testKey);

      expect(cachedData).toEqual(testData);
    });

    it("should allow invalidating queries", async () => {
      const testKey = ["test-query"];
      const testData = { id: 1, name: "Test" };

      queryClient.setQueryData(testKey, testData);
      await queryClient.invalidateQueries({ queryKey: testKey });

      // Check that the query is marked as stale
      const queryState = queryClient.getQueryState(testKey);
      expect(queryState?.isInvalidated).toBe(true);
    });

    it("should allow removing queries", () => {
      const testKey = ["test-query"];
      const testData = { id: 1, name: "Test" };

      queryClient.setQueryData(testKey, testData);
      queryClient.removeQueries({ queryKey: testKey });

      const cachedData = queryClient.getQueryData(testKey);
      expect(cachedData).toBeUndefined();
    });

    it("should allow clearing all queries", () => {
      queryClient.setQueryData(["query1"], { data: 1 });
      queryClient.setQueryData(["query2"], { data: 2 });

      queryClient.clear();

      expect(queryClient.getQueryData(["query1"])).toBeUndefined();
      expect(queryClient.getQueryData(["query2"])).toBeUndefined();
    });
  });

  describe("Query Client Methods", () => {
    it("should have fetchQuery method", () => {
      expect(queryClient.fetchQuery).toBeTypeOf("function");
    });

    it("should have prefetchQuery method", () => {
      expect(queryClient.prefetchQuery).toBeTypeOf("function");
    });

    it("should have invalidateQueries method", () => {
      expect(queryClient.invalidateQueries).toBeTypeOf("function");
    });

    it("should have resetQueries method", () => {
      expect(queryClient.resetQueries).toBeTypeOf("function");
    });

    it("should have cancelQueries method", () => {
      expect(queryClient.cancelQueries).toBeTypeOf("function");
    });

    it("should have isFetching method", () => {
      expect(queryClient.isFetching).toBeTypeOf("function");
    });

    it("should have isMutating method", () => {
      expect(queryClient.isMutating).toBeTypeOf("function");
    });
  });
});
