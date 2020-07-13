import React from 'react';
import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Redirect } from 'react-router';

const useStyles = (theme: Theme) => {
    return createStyles({
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
                backgroundColor: theme.palette.action.selected,
            },
            marginLeft: 0,
            width: '100%',
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
                display: 'inline-block'
            },
        },
        drawerSearch: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
                backgroundColor: theme.palette.action.selected,
            },
            margin: theme.spacing(1),
            width: '-webkit-fill-available',
            display: 'inline-block'
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            width: '100%',
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '20ch',
                '&:focus': {
                    width: '35ch',
                },
            },
        },
        drawerInputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
        },
    });
}

interface SearchBarProps extends WithStyles<typeof useStyles> {
    placeholder: string;
    type: "expandable" | "fixed";
    callback?: (value: string) => void;
    initialValue?: string;
    className?: string;
    style?: React.CSSProperties;
}
interface SearchBarState {
    value: string;
    submitted: boolean;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    constructor(props: SearchBarProps) {
        super(props);
        this.classes = this.props.classes;
        let initialValue = this.props.initialValue?this.props.initialValue:"";
        this.state = { value: initialValue, submitted: false };
    }
    updateSearch(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        if (this.props.callback) {
            this.props.callback(event.target.value);
        }
        this.setState({ ...this.state, value: event.target.value });
    }
    search(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.props.callback) {
            this.props.callback(this.state.value);
            return false;
        }else if (this.state.value !== "") {
            this.setState({ ...this.state, submitted: true });
        }
        return false;
    }
    render() {
        if (this.state.submitted) {
            this.setState({ ...this.state, submitted: false })
            return (<Redirect push to={"/recipes?q=" + this.state.value} />);
        }
        return (
            <form style={this.props.style} onSubmit={(e) => this.search(e)} className={this.props.className}>
                <div className={(this.props.type === "expandable") ? this.classes.search : this.classes.drawerSearch}>
                    <div className={this.classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        onChange={(e) => this.updateSearch(e)}
                        placeholder={this.props.placeholder}
                        classes={{
                            root: this.classes.inputRoot,
                            input: (this.props.type === "expandable") ? this.classes.inputInput : this.classes.drawerInputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        value={this.state.value}
                    />
                </div>
            </form>
        );
    }
}

export default withStyles(useStyles)(SearchBar);