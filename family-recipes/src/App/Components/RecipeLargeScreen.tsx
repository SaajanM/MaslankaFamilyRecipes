import React from 'react';
import { createStyles, Theme, WithStyles, withStyles, lighten } from '@material-ui/core/styles';
import { Card, CardContent, Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import TabPanel from './TabPanel';
import TagChip from './TagChip';

//#region Classes
const useStyles = (theme: Theme) => createStyles({
    "recipeCard": {
        display: "flex",
        margin: "2vw",
        flex: '1 1 auto',
        minHeight: 0,
    },
    "content": {
        display: "flex",
        flex: '1 1 auto',
        minHeight: 0,
        padding: "inherit",
        "&:last-child": {
            paddingBottom: 0
        }
    },
    "overview": {
        margin: theme.spacing(2.5),
        flex: '40%',
        minWidth: 0,
        display: "flex",
        flexDirection: "column"
    },
    "tabNavContainer": {
        margin: theme.spacing(2.5),
        marginLeft: 0,
        flex: '60%',
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
    },
    "tabNavCard": {
        flex: '1 1 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.10),
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    "tabRoot": {
        backgroundColor: lighten(theme.palette.background.paper, 0.10),
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: '1 1 auto',
    },
    "tabCardHeader": {
        backgroundColor: theme.palette.background.default,
    },
    "tag": {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    "tabContent": {
        height: "100%",
        flex: '1 1 auto',
        minHeight: 0,
        overflow: "auto"
    },
    "resultImg": {
        maxWidth: "100%",
        maxHeight: "auto",
        marginBottom: theme.spacing(1),
    },
    "recipeInfo": {
        marginTop: theme.spacing(2.5),
        flex: "1 1 auto",
        minHeight: 0,
        overflow: "auto"
    },
    "swipeableZone": {
        height: "100%",
    },
    "list":{
        "&:not(:last-child)":{
            marginBottom: theme.spacing(1),
        },
    },
});
//#endregion Classes

//#region Types
interface RecipeProps extends WithStyles<typeof useStyles, true> {
    title: string;
    resultImg: string;
    summary: string;
    ingredients: string[];
    steps: string[];
    tags: string[];
    invalid?: boolean;
};
interface RecipeState {
    currentTab: number;
}
//#endregion Types

//#region Main
class RecipeLargeScreen extends React.Component<RecipeProps, RecipeState>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    private theme: Theme;
    constructor(props: RecipeProps) {
        super(props);
        this.classes = this.props.classes;
        this.theme = this.props.theme;
        this.state = { currentTab: 0 };
    }
    a11yProps(index: number) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({ ...this.state, currentTab: newValue });
    }
    handleTabChangeIndex(newIndex: number) {
        this.setState({ ...this.state, currentTab: newIndex });
    }
    render() {
        if (this.props.invalid) {
            return (
                <Card className={this.classes.recipeCard}>
                    <CardContent className={this.classes.content}>
                        <div className={this.classes.overview}>
                            <Typography variant="h4">Recipe Not Found</Typography>
                        </div>
                    </CardContent>
                </Card>
            );
        }
        return (
            //Desktop
            <Card className={this.classes.recipeCard}>
                <CardContent className={this.classes.content}>
                    <div className={this.classes.overview}>
                        <Typography variant="h4">{this.props.title}</Typography>
                        <div>
                            {this.props.tags.map((tag, i) => {
                                return <TagChip label={tag} key={i} link={`/recipes?tags=${tag}`} className={this.classes.tag} />
                            })}
                        </div>
                        <div className={this.classes.recipeInfo}>
                            <img className={this.classes.resultImg} src={this.props.resultImg} alt={this.props.title + ".png"} />
                            <Typography>{this.props.summary}</Typography>
                        </div>

                    </div>
                    <div className={this.classes.tabNavContainer}>
                        <Card className={this.classes.tabNavCard}>
                            <div className={this.classes.tabRoot}>
                                <AppBar position="static" className={this.classes.tabCardHeader}>
                                    <Tabs
                                        value={this.state.currentTab}
                                        onChange={this.handleTabChange.bind(this)}
                                        indicatorColor="secondary"
                                        textColor="secondary"
                                        variant="fullWidth"
                                        aria-label="Tabs"
                                    >
                                        <Tab label="Ingredients" {...this.a11yProps(0)} />
                                        <Tab label="Steps" {...this.a11yProps(1)} />
                                    </Tabs>
                                </AppBar>
                                <CardContent className={this.classes.tabContent}>
                                    <SwipeableViews
                                        className={this.classes.swipeableZone}
                                        axis={this.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={this.state.currentTab}
                                        onChangeIndex={this.handleTabChangeIndex.bind(this)}
                                    >
                                        <TabPanel value={this.state.currentTab} index={0} dir={this.theme.direction}>
                                            <ul>
                                                {this.props.ingredients.map((ingredient, key) => {
                                                    return (<Typography component="li" className={this.classes.list} key={key}>{ingredient}</Typography>);
                                                })}
                                            </ul>
                                        </TabPanel>
                                        <TabPanel value={this.state.currentTab} index={1} dir={this.theme.direction}>
                                            <ol>
                                                {this.props.steps.map((step, key) => {
                                                    return (<Typography component="li" className={this.classes.list} key={key}>{step}</Typography>);
                                                })}
                                            </ol>
                                        </TabPanel>
                                    </SwipeableViews>
                                </CardContent>
                            </div>

                        </Card>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
export default withStyles(useStyles, { withTheme: true })(RecipeLargeScreen);