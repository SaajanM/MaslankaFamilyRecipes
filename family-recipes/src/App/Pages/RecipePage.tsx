import React from 'react';
import Recipe from '../Components/Recipe';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";
import StreamArray from 'stream-json/streamers/StreamArray';
import http from 'http';
import { RecipeInfo } from '../Types/RecipeInfo';


type RecipePageProps = RouteComponentProps & {
    recipe: string;
}
interface RecipePageState extends RecipeInfo {
    invalidRecipe: boolean;
}

class RecipePage extends React.Component<RecipePageProps, RecipePageState>{
    private recipe: string;
    constructor(props: RecipePageProps) {
        super(props);
        this.state = { title: "", resultImg: "", summary: "", ingredients: [], steps: [], tags: [], invalidRecipe: false }
        this.recipe = this.props.location.pathname.substring(8);// everything after /recipe/
    }
    componentDidMount() {
        http.get(`${process.env.REACT_APP_API}/recipe_data.json`, (resp)=>{
            let pipeline = resp.pipe(StreamArray.withParser());
            let found = false;
            pipeline.on('data', data => {
                let result: RecipeInfo & {id:string} = data.value;
                if(result.id === this.recipe){
                    let {id,...recipeInfo} = result;
                    found = true;
                    this.setState({...recipeInfo,invalidRecipe:false});
                    pipeline.end();
                }
            });
            pipeline.on('end',()=>{
                if(!found){
                    this.setState({...this.state,invalidRecipe:true})
                }
            });
        });
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