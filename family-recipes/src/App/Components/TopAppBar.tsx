import React, { ReactNode } from 'react';
import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TemporaryDrawer from './TemporaryDrawer';


//#region Classes
const useStyles = (theme: Theme) =>{
    return createStyles({
        root: {
          flexGrow: 1,
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        title: {
          flexGrow: 1,
        },
    });
}
//#endregion Classes

//#region Types
interface TopAppBarProps extends WithStyles<typeof useStyles>{
    title: string;
}
//#endregion Types

//#region Main
class TopAppBar extends React.Component<TopAppBarProps>{
    private classes:Record<"root" | "menuButton" | "title", string>;
    private children?:ReactNode;
    constructor(props: TopAppBarProps) {
        super(props);
        this.children = this.props.children;
        this.classes = this.props.classes;
    }
    render(){
        return (
            <div className={this.classes.root}>
              <AppBar position="static">
                <Toolbar>
                <TemporaryDrawer anchor="left"></TemporaryDrawer>
                  <Typography variant="h6" className={this.classes.title}>
                    {this.props.title}
                  </Typography>
                </Toolbar>
              </AppBar>
              
            </div>
          );
    }
}
export default withStyles(useStyles)(TopAppBar);
//#endregion Main