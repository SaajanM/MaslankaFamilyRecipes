import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

interface DrawerListIconItemProps{
    title: string;
    icon: typeof SvgIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
    }>;
    link: string;
    viewBox?: string;
}

export default class DrawerListIconItem extends React.Component<DrawerListIconItemProps>{
    render() {
        return (
            <ListItem button key={this.props.title} component={Link} to={this.props.link}>
                <ListItemIcon><SvgIcon component={this.props.icon} viewBox = {this.props.viewBox}></SvgIcon></ListItemIcon>
                <ListItemText primary={this.props.title} />
            </ListItem>
        );
    }
}