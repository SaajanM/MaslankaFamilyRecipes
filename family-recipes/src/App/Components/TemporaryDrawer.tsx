import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

//#region Classes
const useStyles = (theme: Theme) => createStyles({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    list: {
        paddingTop: theme.spacing(1),
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});
//#endregion Classes

//#region Types
type Anchor = 'top' | 'left' | 'bottom' | 'right';
interface TempDrawerProps extends WithStyles<typeof useStyles> {
    anchor: Anchor;
};
interface TempDrawerState {
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
}
//#endregion Types

//#region Main
class TemporaryDrawer extends React.Component<TempDrawerProps, TempDrawerState>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    constructor(props: TempDrawerProps) {
        super(props);
        this.classes = this.props.classes;
        this.state = { top: false, left: false, bottom: false, right: false};
    }
    toggleDrawer(anchor: Anchor, open: boolean){
        return (
            event: React.KeyboardEvent | React.MouseEvent,
        ) => {
            if (
                event &&
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
    
            this.setState({ ...this.state, [anchor]: open });
        };
    }
    list(anchor: Anchor){
        return (
            <div
                className={clsx(this.classes.list, {
                    [this.classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"
            >
                {this.props.children}
            </div>
        );
    }
    render(){
        return (
            <div>
                <React.Fragment key={this.props.anchor}>
                    <IconButton onClick={this.toggleDrawer(this.props.anchor, true)} edge="start" className={this.classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer anchor={this.props.anchor} open={this.state[this.props.anchor]} onOpen={this.toggleDrawer(this.props.anchor, true)} onClose={this.toggleDrawer(this.props.anchor, false)}>
                        {this.list(this.props.anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            </div>
        );
    }
}

export default withStyles(useStyles)(TemporaryDrawer);
//#endregion Main