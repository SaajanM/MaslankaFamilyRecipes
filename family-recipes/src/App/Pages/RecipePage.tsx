import React from 'react';

interface RecipePageProps{
    recipe:string;
}
interface RecipePageState{
    resultImg: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
}
export default class RecipePage extends React.Component<RecipePageProps,RecipePageState>{
    constructor(props: RecipePageProps){
        super(props);
        this.state = {resultImg:"",summary:"",ingredients:[],steps:[],tags:[]}
    }
    componentDidMount(){
        fetch('api.github.com/repos/SaajanM/')
    }
}