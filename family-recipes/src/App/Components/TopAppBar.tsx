import React, { ReactNode } from 'react';
import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TemporaryDrawer from './TemporaryDrawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import SortIcon from '@material-ui/icons/Sort';
import StarIcon from '@material-ui/icons/Star';
import CasinoIcon from '@material-ui/icons/Casino';
import { ReactComponent as BreakfastIcon } from '../Icons/breakfast-dining.svg';
import { ReactComponent as LunchIcon } from '../Icons/lunch-dining.svg';
import { ReactComponent as DinnerIcon } from '../Icons/dinner-dining.svg';
import { ReactComponent as DessertIcon } from '../Icons/icecream.svg';
import { ReactComponent as SnackIcon } from '../Icons/snacks.svg';
import DrawerListIconItem from './DrawerListIconItem';
import SearchBar from './SearchBar';
import StreamArray from 'stream-json/streamers/StreamArray';
import http from 'http';
import { RecipeInfo } from '../Types/RecipeInfo';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

//#region Classes
const useStyles = (theme: Theme) => {
    return createStyles({
        root: {
            flexGrow: 0,

        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            marginTop: '1.5px',
            marginBottom: '1.5px',
            color: "inherit",
            textDecoration: "none",
            "&:visited": {
                color: "inherit"
            },
        },
        appBar: {
            backgroundColor: theme.palette.background.default,
        },
    });
};
//#endregion Classes

//#region Types
enum RedirectEnum {
    STAY,
    RANDOM_RECIPE
}
type TopAppBarProps = RouteComponentProps & WithStyles<typeof useStyles> & {
    title: string;
}
interface TopAppBarState {
    redirectTo: RedirectEnum;
    randomRecipeId?: string;
}
//#endregion Types

//#region Main
class TopAppBar extends React.Component<TopAppBarProps, TopAppBarState>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    private children?: ReactNode;
    constructor(props: TopAppBarProps) {
        super(props);
        this.children = this.props.children;
        this.classes = this.props.classes;
        this.state = { redirectTo: RedirectEnum.STAY };
    }
    randomRecipe() {
        let randomId: string;
        let currentComponent = this;
        http.get(`${process.env.REACT_APP_API}/recipe_data.json`, (resp) => {
            let pipeline = resp.pipe(StreamArray.withParser());
            let recipes: (RecipeInfo & { id: string })[] = [];
            let result: RecipeInfo & { id: string };
            pipeline.on('data', data => {
                result = data.value;
                recipes.push(result);
            });
            pipeline.on('end', () => {
                let rand = Math.floor(Math.random() * recipes.length);
                randomId = recipes[rand].id;
                currentComponent.setState({ ...currentComponent.state, redirectTo: RedirectEnum.RANDOM_RECIPE, randomRecipeId: randomId });
            });
        });
    }

    render() {
        if (this.state.redirectTo === RedirectEnum.RANDOM_RECIPE) {
            this.setState({redirectTo: RedirectEnum.STAY});
            return (<Redirect to={`/recipe/${this.state.randomRecipeId}`} />);
        }
        return (
            <div className={this.classes.root}>
                <AppBar position="static" className={this.classes.appBar}>
                    <Toolbar>
                        <TemporaryDrawer anchor="left">
                            <ListSubheader style={{display:((this.props.location.pathname === "/recipes")?"none":"inline-block")}} disableSticky={true}>Recipe Search</ListSubheader>
                            <SearchBar style={{display:((this.props.location.pathname === "/recipes")?"none":"inline-block")}} type="fixed" placeholder="Search Recipes..."></SearchBar>
                            <ListSubheader disableSticky={true}>Quick Links</ListSubheader>
                            <List>
                                <DrawerListIconItem title="Browse Recipes" icon={SortIcon} link="/recipes"></DrawerListIconItem>
                                <DrawerListIconItem title="Recommended" icon={StarIcon} link="/recipes?tags=recommended"></DrawerListIconItem>
                                <DrawerListIconItem title="Random Recipe" icon={CasinoIcon} onClick={()=>this.randomRecipe()}></DrawerListIconItem>
                            </List>
                            <ListSubheader disableSticky={true}>Meal Types</ListSubheader>
                            <List>
                                <DrawerListIconItem title="Breakfasts" icon={BreakfastIcon} viewBox="0 0 512 512" link="/recipes?tags=breakfast"></DrawerListIconItem>
                                <DrawerListIconItem title="Lunches" icon={LunchIcon} viewBox="0 0 512 512" link="/recipes?tags=lunch"></DrawerListIconItem>
                                <DrawerListIconItem title="Dinners" icon={DinnerIcon} viewBox="0 0 512 512" link="/recipes?tags=dinner"></DrawerListIconItem>
                                <DrawerListIconItem title="Desserts" icon={DessertIcon} viewBox="0 0 512 512" link="/recipes?tags=dessert"></DrawerListIconItem>
                                <DrawerListIconItem title="Snacks" icon={SnackIcon} viewBox="0 0 24 24" link="/recipes?tags=snack"></DrawerListIconItem>
                            </List>
                        </TemporaryDrawer>
                        <Typography variant="h6" className={this.classes.title} component={Link} to="/">{this.props.title} </Typography>
                        <SearchBar style={{display:((this.props.location.pathname === "/recipes")?"none":"inline-block")}} type="expandable" placeholder="Search Recipes..."></SearchBar>
                    </Toolbar>
                </AppBar>

            </div>
        );
    }
}
export default withRouter(withStyles(useStyles)(TopAppBar));
//#endregion Main