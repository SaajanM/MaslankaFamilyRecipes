import React from 'react';
import { createStyles, Theme, WithStyles, withStyles, lighten, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import TabPanel from './TabPanel';

//#region Classes
const useStyles = (theme: Theme) => createStyles({
    "recipeCard": {
        margin: theme.spacing(5),
        width: "inherit",
        height: "inherit",
    },
    "content": {
        display: "flex",
        height: "-webkit-fill-available",
        padding: "inherit",
        "&:last-child": {
            paddingBottom: 0
        }
    },
    "overview": {
        margin: theme.spacing(2.5),
        flex: '40%'
    },
    "tabNavContainer": {
        margin: theme.spacing(2.5),
        flex: '60%'
    },
    "tabNavCard": {
        height: "100%",
        backgroundColor: lighten(theme.palette.background.paper, 0.10)
    },
    "tabRoot": {
        backgroundColor: lighten(theme.palette.background.paper, 0.10),
        width: 500,
    }
});
//#endregion Classes

//#region Types
interface RecipeProps extends WithStyles<typeof useStyles> {
    title?: string;
    resultImg?: string;
    summary?: string;
    ingredients?: string[];
    steps?: string[];
    tags?: string[];
};
interface RecipeState{
    currentTab: number;
}
//#endregion Types

//#region Main
class Recipe extends React.Component<RecipeProps,RecipeState>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    private theme: Theme;
    constructor(props: RecipeProps) {
        super(props);
        this.classes = this.props.classes;
        this.theme = useTheme();
        this.state = {currentTab:0};
    }
    a11yProps(index: number) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    handleTabChange(event: React.ChangeEvent<{}>, newValue: number){
        this.setState({...this.state, currentTab:newValue});
    }
    handleTabChangeIndex(newIndex: number){
        this.setState({...this.state, currentTab:newIndex});
    }
    render() {
        return (
            //Desktop
            <Card className={this.classes.recipeCard}>
                <CardContent className={this.classes.content}>
                    <div className={this.classes.overview}>
                        <Typography variant="h4">Naan</Typography>
                    </div>
                    <div className={this.classes.tabNavContainer}>
                        <Card className={this.classes.tabNavCard}>
                            <CardContent>
                                <div className={this.classes.tabRoot}>
                                    <AppBar position="static" color="default">
                                        <Tabs
                                            value={this.state.currentTab}
                                            onChange={this.handleTabChange.bind(this)}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="fullWidth"
                                            aria-label="full width tabs example"
                                        >
                                            <Tab label="Item One" {...this.a11yProps(0)} />
                                            <Tab label="Item Two" {...this.a11yProps(1)} />
                                            <Tab label="Item Three" {...this.a11yProps(2)} />
                                        </Tabs>
                                    </AppBar>
                                    <SwipeableViews
                                        axis={this.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={this.state.currentTab}
                                        onChangeIndex={this.handleTabChangeIndex.bind(this)}
                                    >
                                        <TabPanel value={this.state.currentTab} index={0} dir={this.theme.direction}>
                                            Item One
                                        </TabPanel>
                                        <TabPanel value={this.state.currentTab} index={1} dir={this.theme.direction}>
                                            Item Two
                                        </TabPanel>
                                        <TabPanel value={this.state.currentTab} index={2} dir={this.theme.direction}>
                                            Item Three
                                        </TabPanel>
                                    </SwipeableViews>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        );
    }
}
export default withStyles(useStyles)(Recipe);