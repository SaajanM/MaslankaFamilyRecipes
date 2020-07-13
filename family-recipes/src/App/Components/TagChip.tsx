import React from 'react';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import { RecipeTag } from '../Types/RecipeTag';

interface CommonProps {
    label: RecipeTag;
    className?: string;
}
interface TagPropsLink extends CommonProps {
    variant: "link";
    link: string;
}
interface TagPropsSelector extends CommonProps {
    variant: "selector";
    onSelect: (label: RecipeTag) => void;
    onDeselect: (label: RecipeTag) => void;
    initialValue?: boolean;
}
type TagChipProps = TagPropsLink | TagPropsSelector;

interface TagChipState {
    selected?: boolean;
}


export default class TagChip extends React.Component<TagChipProps, TagChipState>{
    constructor(props: TagChipProps) {
        super(props);
        this.state = this.props.variant === "selector" && this.props.initialValue ? { selected: true } : {};
    }
    render() {
        if (this.props.variant === "link") {
            return (
                <Chip size="small" label={this.props.label} component={Link} to={this.props.link as string} clickable className={this.props.className} />
            );
        } else if (this.props.variant === "selector") {
            if (this.state.selected) {
                return (
                    <Chip size="small" color="secondary" label={this.props.label} clickable className={this.props.className} onClick={() => this.toggleChip()}></Chip>
                );
            } else {
                return (
                    <Chip size="small" variant="outlined" label={this.props.label} clickable className={this.props.className} onClick={() => this.toggleChip()}></Chip>
                );
            }
        }
    }
    toggleChip() {
        if (this.props.variant !== "selector") return;

        if (this.state.selected) {
            this.setState({ selected: false });
            this.props.onDeselect(this.props.label);
        } else {
            this.setState({ selected: true });
            this.props.onSelect(this.props.label);
        }
    }
}