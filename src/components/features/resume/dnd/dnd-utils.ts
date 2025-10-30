/**
 * Utility functions for drag and drop operations
 */

/**
 * Reorder an array by moving an item from one index to another
 * @param list - The array to reorder
 * @param startIndex - The index of the item to move
 * @param endIndex - The destination index
 * @returns A new array with the item moved
 */
export function reorderArray<T>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Check if an array has items that can be reordered
 * @param list - The array to check
 * @returns True if the array has 2 or more items
 */
export function canReorder<T>(list: T[] | undefined): boolean {
  return Array.isArray(list) && list.length > 1;
}

/**
 * Get a unique ID for a drag operation
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export function getDragId(prefix = "drag"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
