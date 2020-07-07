import React from 'react';
import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import SearchBar from '../Components/SearchBar';
import {Link} from 'react-router-dom';

const useStyles = (theme: Theme) => {
    return createStyles({
        hero: {
            flexGrow: 1,
            position: 'relative',
        },
        heroInner: {
            textAlign: 'center',
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: '80vw',
            transform: 'translate(-50%, -50%)',
            color: theme.palette.text.primary,
        },
        heroSecondary: {
            color: theme.palette.text.secondary,
        },
        heroSearch: {
            maxWidth: '400px',
            margin:'auto',
        },
        heroBrowse: {
            maxWidth: '300px',
            margin:'auto',
            color: theme.palette.text.secondary,
        }
    });
};

class MainPage extends React.Component<WithStyles<typeof useStyles>> {
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    constructor(props: WithStyles<typeof useStyles>) {
        super(props);
        this.classes = this.props.classes;
    }
    render() {
        return (
            <div className={this.classes.hero}>
                <div className={this.classes.heroInner}>
                    <h1>Maslanka Family Recipes</h1>
                    <p className={this.classes.heroSecondary}>Recipes Done Right</p>
                    <div className={this.classes.heroSearch}>
                        <SearchBar type="fixed" placeholder="Find Something Delicious..."></SearchBar>
                    </div>
                    <p>or</p>
                    <div className={this.classes.heroBrowse}>
                        <Button color="inherit" component={Link} to="/recipes">Browse All Recipes</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default withStyles(useStyles)(MainPage);