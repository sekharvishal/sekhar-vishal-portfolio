/**
 * Content marked `TODO` in `content.ts` is a reminder for the author, never copy for visitors.
 * Every public surface filters through these helpers so placeholders cannot leak.
 */
export const isPending = (text: string): boolean => /TODO/i.test(text)

export const publicList = (items: readonly string[]): string[] => items.filter((item) => !isPending(item))
