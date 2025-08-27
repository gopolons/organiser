// Utility function for pasing tags from string
export const parseTagsFromText = (text: string): string[] => {
  return text.trim().split(/\s+/).filter(Boolean);
};

// Utility function for adding unique tags to array
export const addUniqueTagsToArray = (
  existingTags: string[],
  newTags: string[],
): string[] => {
  return Array.from(new Set([...existingTags, ...newTags]));
};

// Utility function for removing tasks from an array
export const removeTagFromArray = (
  tags: string[],
  tagToRemove: string,
): string[] => {
  return tags.filter((tag) => tag !== tagToRemove);
};
