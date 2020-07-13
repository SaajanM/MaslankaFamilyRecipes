export const validTags = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Side",
    "Recommended",
    "Mexican",
    "American",
    "Italian",
    "French",
    "Indian",
    "Chinese",
    "Japanese",
    "Vegan",
    "Vegetarian",
    "Seafood",
    "Meat",
    "Easy",
    "Medium",
    "Difficult",
    "Fast",
    "Slow",
    "Bread",
    "Eggs",
] as const;
export type RecipeTag = typeof validTags[number];
export function isValidTag(tag: string): tag is RecipeTag {
    return validTags.indexOf(tag as RecipeTag) !== -1;
}