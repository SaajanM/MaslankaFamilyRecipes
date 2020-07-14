import React from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import TagChip from './TagChip';
import { RecipeTag } from '../Types/RecipeTag';
import { Link } from 'react-router-dom';

const useStyles = (theme: Theme) => createStyles({
    "resultCardContent": {
        display: "flex",
        flexDirection: "row",
        padding: "inherit",
        "&:last-child": {
            paddingBottom: 0
        }
    },
    "info": {
        flex: "70%",
        margin: theme.spacing(1.5),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minWidth: 0,
    },
    "image": {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        boxShadow: theme.shadows[1],
        borderRadius: "4px",
    },
    "tags": {
        display: "none",
        width: "100%",
        overflowX: "auto",
        flexDirection: "row",
        flexWrap: "nowrap",
        flexShrink: 0,
        [theme.breakpoints.up('sm')]: {
            display: "flex",
        },
    },
    "tag": {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(1),
        position: "relative",
        zIndex: 999,
    },
    "imageContainer": {
        flex: "30%",
        margin: theme.spacing(1.5),
        marginLeft: 0,
        minWidth: 0,
        maxWidth: "17.5vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    "imageContainer2": {
        position: "relative",
        width: "100%",
        paddingTop: "66.66%",
    },
    "title": {
        flexShrink: 0,
    },
    "overview": {
        height: "100%",
        overflow: "hidden",
        "&::after": {
            content: 'no-open-quote',
            width: "100%",
            height: "min(1.5rem, 100%)",
            position: "absolute",
            left: 0,
            bottom: 0,
            background: `linear-gradient(transparent, ${theme.palette.background.paper})`,
        },
    },
    "overviewContainer": {
        flexGrow: 1,
        height: 0,
        display: "none",
        marginTop: theme.spacing(1),
        position: "relative",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        },
    },
    "resultCard": {
        width: "100%",
        position: "relative",
    },
    "link": {
        color: "inherit",
        textDecoration: "none",
        "&:visited": {
            color: "inherit"
        },
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
    }
});
interface SearchResultPropsCommon extends WithStyles<typeof useStyles> {
    className?: string;
    htmlId?: string;
}
interface SearchResultPropsRecipeVariant extends SearchResultPropsCommon{
    variant: "recipe";
    tags: RecipeTag[];
    title: string;
    id: string;
    resultImg: string;
    overview: string;
}
interface SearchResultPropsMessageVariant extends SearchResultPropsCommon {
    variant: "message";
    message: string;
    subMessage?: string;
}
type SearchResultProps = SearchResultPropsMessageVariant | SearchResultPropsRecipeVariant;

class SearchResultCard extends React.Component<SearchResultProps>{
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    constructor(props: SearchResultProps) {
        super(props);
        this.classes = this.props.classes;
    }
    render() {
        if (this.props.variant === "recipe") {
            return (
                <Card className={`${this.classes.resultCard} ${this.props.className}`} id={this.props.htmlId}>
                    <CardContent className={this.classes.resultCardContent}>
                        <div className={this.classes.info}>
                            <Typography className={this.classes.title} variant="h5">{this.props.title}</Typography>
                            <div className={this.classes.tags}>
                                {this.props.tags.map((tag, i) => {
                                    return <TagChip variant="link" label={tag} key={i} link={`/recipes?tags=${tag}`} className={this.classes.tag} />
                                })}
                            </div>
                            <div className={this.classes.overviewContainer}>
                                <Typography className={this.classes.overview}>{this.props.overview}</Typography>
                            </div>
                        </div>
                        <div className={this.classes.imageContainer}>
                            <div className={this.classes.imageContainer2}>
                                <img className={this.classes.image} src={this.props.resultImg} alt={this.props.title + ".png"}></img>
                            </div>
                        </div>

                    </CardContent>
                    <Link className={this.classes.link} to={`/recipe/${this.props.id}`}></Link>
                </Card>
            );
        }else if(this.props.variant === "message"){
            return (
                <Card className={`${this.classes.resultCard} ${this.props.className}`} id={this.props.htmlId}>
                <CardContent className={this.classes.resultCardContent}>
                    <div className={this.classes.info}>
                        <Typography className={this.classes.title} variant="h5">{this.props.message}</Typography>
                        <div className={this.classes.overviewContainer}>
                            <Typography className={this.classes.overview}>{this.props.subMessage}</Typography>
                        </div>
                    </div>
                    <div className={this.classes.imageContainer}>
                        <div className={this.classes.imageContainer2}>
                        </div>
                    </div>
                </CardContent>
            </Card>
            );
        }
    }
}

export default withStyles(useStyles)(SearchResultCard);