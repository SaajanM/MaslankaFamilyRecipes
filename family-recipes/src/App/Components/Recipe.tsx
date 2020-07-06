import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import RecipeLargeScreen from './RecipeLargeScreen';
import RecipeSmallScreen from './RecipeSmallScreen';

const useStyles = (theme: Theme) => createStyles({
    "smallRecipe": {
        display: "none",
        width: "inherit",
        flex: "1 1 auto",
        [theme.breakpoints.down('sm')]: {
            display: "flex"
        }
    },
    "largeRecipe": {
        display: "none",
        width: "inherit",
        flex: "1 1 auto",
        [theme.breakpoints.up('md')]: {
            display: "flex"
        }
    },
    "recipeRoot": {
        width: "inherit",
        height: "inherit",
        display: "flex"
    }
});

interface RecipeProps extends WithStyles<typeof useStyles> {
    title: string;
    resultImg: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    tags?: string[];
};

class Recipe extends React.Component<RecipeProps>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    constructor(props: RecipeProps) {
        super(props);
        this.classes = this.props.classes;
    }
    render() {
        return (
            <div className={this.classes.recipeRoot}>
                <div className={this.classes.largeRecipe}>
                    <RecipeLargeScreen
                        title={this.props.title}
                        resultImg={this.props.resultImg}
                        summary={this.props.summary}
                        ingredients={this.props.ingredients}
                        steps={this.props.steps}
                        tags={this.props.tags}
                    ></RecipeLargeScreen>
                </div>
                <div className={this.classes.smallRecipe}>
                    <RecipeSmallScreen
                    ></RecipeSmallScreen>
                </div>
            </div>
        );
    }
}

export default withStyles(useStyles)(Recipe);