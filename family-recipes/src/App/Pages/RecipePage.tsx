import React from 'react';
import Recipe from '../Components/Recipe';
import { Octokit } from '@octokit/rest';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

type RecipePageProps = RouteComponentProps & {
    recipe: string;
}
interface RecipePageState {
    title: string;
    resultImg: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    invalidRecipe: boolean;
}

class RecipePage extends React.Component<RecipePageProps, RecipePageState>{
    private ok = new Octokit({ auth: process.env.REACT_APP_GITHUB_TOKEN });
    private recipe: string;
    constructor(props: RecipePageProps) {
        super(props);
        this.state = { title: "", resultImg: "", summary: "", ingredients: [], steps: [], tags: [], invalidRecipe: false }
        this.recipe = this.props.location.pathname.substring(8);// everything after /recipe/
    }
    componentDidMount() {
        this.ok.repos.getContent({
            owner: "SaajanM",
            repo: "MaslankaFamilyRecipes",
            path: "family-recipes/recipes"
        }).then(response => {
            let validRecipes = response.data as unknown as { name: string }[];
            validRecipes = validRecipes.filter(r => r.name === this.recipe + ".json");
            if (validRecipes.length !== 0) {
                this.ok.repos.getContent({
                    owner: "SaajanM",
                    repo: "MaslankaFamilyRecipes",
                    path: `family-recipes/recipes/${this.recipe}.json`
                }).then(response => {
                    this.setState(JSON.parse(atob(response.data.content)));
                });
            }else{
                this.setState({...this.state,invalidRecipe:true})
            }
        })

        // this.ok.repos.getContent({
        //     owner:"SaajanM",
        //     repo:"MaslankaFamilyRecipes",
        //     path:`family-recipes/recipes/${this.recipe}.json`
        // }).then(response=>{

        //     this.setState(JSON.parse(atob(response.data.content)));
        // });

    }
    render() {
        if (this.state.invalidRecipe) {
            return (
                <Recipe
                    title="Recipe Not Found"
                    resultImg=""
                    summary=""
                    ingredients={[]}
                    steps={[]}
                    tags={[]}
                    invalid={true}
                ></Recipe>
            );
        }
        return (
            <Recipe
                title={this.state.title}
                resultImg={this.state.resultImg}
                summary={this.state.summary}
                ingredients={this.state.ingredients}
                steps={this.state.steps}
                tags={this.state.tags}
            ></Recipe>
        );
    }
}
export default withRouter(RecipePage)