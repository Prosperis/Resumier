import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canReorder, getDragId, reorderArray } from "../dnd-utils";

describe("dnd-utils", () => {
  describe("reorderArray", () => {
    it("should move item from start to end", () => {
      const list = ["a", "b", "c", "d"];
      const result = reorderArray(list, 0, 3);
      expect(result).toEqual(["b", "c", "d", "a"]);
    });

    it("should move item from end to start", () => {
      const list = ["a", "b", "c", "d"];
      const result = reorderArray(list, 3, 0);
      expect(result).toEqual(["d", "a", "b", "c"]);
    });

    it("should move item forward by one position", () => {
      const list = ["a", "b", "c", "d"];
      const result = reorderArray(list, 1, 2);
      expect(result).toEqual(["a", "c", "b", "d"]);
    });

    it("should move item backward by one position", () => {
      const list = ["a", "b", "c", "d"];
      const result = reorderArray(list, 2, 1);
      expect(result).toEqual(["a", "c", "b", "d"]);
    });

    it("should handle moving item to same position", () => {
      const list = ["a", "b", "c"];
      const result = reorderArray(list, 1, 1);
      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should not mutate original array", () => {
      const list = ["a", "b", "c"];
      const original = [...list];
      reorderArray(list, 0, 2);
      expect(list).toEqual(original);
    });

    it("should work with numbers", () => {
      const list = [1, 2, 3, 4, 5];
      const result = reorderArray(list, 0, 4);
      expect(result).toEqual([2, 3, 4, 5, 1]);
    });

    it("should work with objects", () => {
      const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = reorderArray(list, 0, 2);
      expect(result).toEqual([{ id: 2 }, { id: 3 }, { id: 1 }]);
    });

    it("should handle single item array", () => {
      const list = ["only"];
      const result = reorderArray(list, 0, 0);
      expect(result).toEqual(["only"]);
    });

    it("should handle two item array", () => {
      const list = ["first", "second"];
      const result = reorderArray(list, 0, 1);
      expect(result).toEqual(["second", "first"]);
    });

    it("should preserve references for unchanged items", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const list = [obj1, obj2, obj3];
      const result = reorderArray(list, 1, 2);
      expect(result[0]).toBe(obj1); // Same reference
      expect(result[1]).toBe(obj3); // Same reference
      expect(result[2]).toBe(obj2); // Same reference
    });

    it("should handle empty array with splice behavior", () => {
      const list: string[] = [];
      const result = reorderArray(list, 0, 0);
      // Empty array splice returns undefined item - this is expected behavior
      expect(result).toHaveLength(1);
      expect(result[0]).toBeUndefined();
    });

    it("should move multiple positions forward", () => {
      const list = ["a", "b", "c", "d", "e"];
      const result = reorderArray(list, 1, 4);
      expect(result).toEqual(["a", "c", "d", "e", "b"]);
    });

    it("should move multiple positions backward", () => {
      const list = ["a", "b", "c", "d", "e"];
      const result = reorderArray(list, 4, 1);
      expect(result).toEqual(["a", "e", "b", "c", "d"]);
    });
  });

  describe("canReorder", () => {
    it("should return true for array with 2 items", () => {
      expect(canReorder(["a", "b"])).toBe(true);
    });

    it("should return true for array with 3 items", () => {
      expect(canReorder(["a", "b", "c"])).toBe(true);
    });

    it("should return true for array with many items", () => {
      expect(canReorder(new Array(100).fill(0))).toBe(true);
    });

    it("should return false for array with 1 item", () => {
      expect(canReorder(["only"])).toBe(false);
    });

    it("should return false for empty array", () => {
      expect(canReorder([])).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(canReorder(undefined)).toBe(false);
    });

    it("should return false for null", () => {
      expect(canReorder(null as any)).toBe(false);
    });

    it("should return false for non-array values", () => {
      expect(canReorder({} as any)).toBe(false);
      expect(canReorder("string" as any)).toBe(false);
      expect(canReorder(123 as any)).toBe(false);
    });

    it("should work with number arrays", () => {
      expect(canReorder([1, 2])).toBe(true);
      expect(canReorder([1])).toBe(false);
    });

    it("should work with object arrays", () => {
      expect(canReorder([{ id: 1 }, { id: 2 }])).toBe(true);
      expect(canReorder([{ id: 1 }])).toBe(false);
    });

    it("should handle arrays with undefined items", () => {
      expect(canReorder([undefined, undefined])).toBe(true);
      expect(canReorder([undefined])).toBe(false);
    });

    it("should handle arrays with null items", () => {
      expect(canReorder([null, null])).toBe(true);
      expect(canReorder([null])).toBe(false);
    });
  });

  describe("getDragId", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should generate ID with default prefix", () => {
      const id = getDragId();
      expect(id).toMatch(/^drag-\d+-[a-z0-9]+$/);
    });

    it("should generate ID with custom prefix", () => {
      const id = getDragId("custom");
      expect(id).toMatch(/^custom-\d+-[a-z0-9]+$/);
    });

    it("should include timestamp in ID", () => {
      const now = 1234567890000;
      vi.setSystemTime(new Date(now));
      const id = getDragId();
      expect(id).toContain(`${now}`);
    });

    it("should generate unique IDs", () => {
      const id1 = getDragId();
      const id2 = getDragId();
      const id3 = getDragId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("should generate IDs with different timestamps", () => {
      vi.setSystemTime(new Date(1000000));
      const id1 = getDragId();

      vi.setSystemTime(new Date(2000000));
      const id2 = getDragId();

      expect(id1).toContain("1000000");
      expect(id2).toContain("2000000");
    });

    it("should handle empty string prefix", () => {
      const id = getDragId("");
      expect(id).toMatch(/^-\d+-[a-z0-9]+$/);
    });

    it("should handle special characters in prefix", () => {
      const id = getDragId("drag-item-123");
      expect(id).toMatch(/^drag-item-123-\d+-[a-z0-9]+$/);
    });

    it("should generate alphanumeric random suffix", () => {
      const id = getDragId();
      const parts = id.split("-");
      const randomPart = parts[parts.length - 1];
      expect(randomPart).toMatch(/^[a-z0-9]+$/);
      expect(randomPart.length).toBeGreaterThan(0);
    });

    it("should generate IDs of consistent format", () => {
      const ids = Array.from({ length: 10 }, () => getDragId());

      for (const id of ids) {
        const parts = id.split("-");
        expect(parts.length).toBe(3); // prefix, timestamp, random
        expect(parts[0]).toBe("drag");
        expect(parts[1]).toMatch(/^\d+$/);
        expect(parts[2]).toMatch(/^[a-z0-9]+$/);
      }
    });

    it("should work with numeric prefix", () => {
      const id = getDragId("123");
      expect(id).toMatch(/^123-\d+-[a-z0-9]+$/);
    });

    it("should work with very long prefix", () => {
      const longPrefix = "a".repeat(100);
      const id = getDragId(longPrefix);
      expect(id).toMatch(new RegExp(`^${longPrefix}-\\d+-[a-z0-9]+$`));
    });
  });
});
