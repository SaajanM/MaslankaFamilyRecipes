import { RecipeTag } from "./RecipeTag";

export type RecipeInfo<T = unknown> = T & {
    title: string;
    resultImg: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    tags: RecipeTag[];
}