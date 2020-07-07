import React from 'react';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';

interface TagChipProps{
    label: string;
    link: string;
    className?: string;
}

export default class TagChip extends React.Component<TagChipProps>{
    render(){
        return(
            <Chip size="small" label={this.props.label} component={Link} to={this.props.link} clickable className={this.props.className}/>
        );
    }
}