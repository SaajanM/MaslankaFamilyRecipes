import React, { forwardRef } from 'react';
import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import SearchResultCard from '../Components/SearchResultCard';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import { RecipeTag, isValidTag } from '../Types/RecipeTag';
import { Fab, SvgIcon, Tooltip, Typography, Zoom } from '@material-ui/core';
import { ReactComponent as FilterSearchIcon } from '../Icons/filter-search.svg';
import SettingsDialog from '../Components/SettingsDialog';
import { validTags } from '../Types/RecipeTag';
import TagChip from '../Components/TagChip';
import SearchBar from '../Components/SearchBar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { RecipeInfo } from '../Types/RecipeInfo';
import StreamArray from 'stream-json/streamers/StreamArray';
import http from 'http';

const BASE_SIMILARITY = 0.9;

const useStyles = (theme: Theme) => {
    return createStyles({
        "bigIcon": {
            position: "absolute",
            bottom: 0,
            [theme.breakpoints.between('xs', 'sm')]: {
                "& > span > svg": {
                    width: "1em",
                    height: "1em"
                },
                width: "56px",
                height: "56px",
                margin: theme.spacing(4),
            },
            [theme.breakpoints.only('md')]: {
                "& > span > svg": {
                    width: "1.1em",
                    height: "1.1em"
                },
                width: "62px",
                height: "62px",
                margin: theme.spacing(5),
            },
            [theme.breakpoints.only('lg')]: {
                "& > span > svg": {
                    width: "1.2em",
                    height: "1.2em"
                },
                width: "67px",
                height: "67px",
                margin: theme.spacing(5.5),
            },
            [theme.breakpoints.only('xl')]: {
                "& > span > svg": {
                    width: "1.3em",
                    height: "1.3em"
                },
                width: "73px",
                height: "73px",
                margin: theme.spacing(6),
            },
            [theme.breakpoints.only('xxl')]: {
                "& > span > svg": {
                    width: "1.45em",
                    height: "1.45em"
                },
                width: "81px",
                height: "81px",
                margin: theme.spacing(6.5),
            },
            [theme.breakpoints.only('xxxl')]: {
                "& > span > svg": {
                    width: "1.7em",
                    height: "1.7em"
                },
                width: "95px",
                height: "95px",
                margin: theme.spacing(7),
            },
            [theme.breakpoints.only('xxxxl')]: {
                "& > span > svg": {
                    width: "2.5em",
                    height: "2.5em"
                },
                width: "140px",
                height: "140px",
                margin: theme.spacing(7.5),
            }
        },
        "filterFab": {
            right: 0,
        },
        "upFab": {
            left: 0,
        },
        "tagSection": {
            "& > *": {
                marginBottom: theme.spacing(1),
            }
        },
        "filterTag": {
            "&:not(:last-child)": {
                marginRight: theme.spacing(0.5),
            },
        },
        "searchSection": {

        },
        "searchBar": {
            "& > div": {
                marginLeft: 0,
                marginRight: 0,
            }
        },
        "root": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            overflow: "auto",
        },
        "results": {
            width: "100%",
            height: "100%",
            alignSelf: "center",
        },
        "filterDialog": {
            "& .MuiDialog-paperWidthSm": {
                maxWidth: "400px",
            }
        },
        "sampleResult": {
            position: "absolute",
            left: 0,
            top: 0,
            visibility: "hidden",
            zIndex: -999,
        },
        "result": {
            padding: theme.spacing(1.5, 0),
        },
        "list": {
            "& > div": {
                transform: "translateX(26.25%)",
            }
        }
    });
};

const topRef = React.createRef<HTMLDivElement>();
const listRef = React.createRef<VariableSizeList>();
const outerListRef = React.createRef<HTMLDivElement>();

enum RedirectEnum {
    STAY,
    UPDATE_SETTINGS,
    UPDATE_TRIGGERED,
}

type SearchPageProps = RouteComponentProps & WithStyles<typeof useStyles>;

interface SearchPageState {
    selectedTags: Set<RecipeTag>;
    query: string;
    modalOpen: boolean;
    redirect: RedirectEnum;
    showReturnTop: boolean;
}

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
    private classes: Record<keyof ReturnType<typeof useStyles>, string>;
    private unconfirmedSettings: { query: string, tags: Set<RecipeTag> };
    private items: JSX.Element[];
    constructor(props: SearchPageProps) {
        super(props);
        this.state = { selectedTags: new Set<RecipeTag>(), query: "", modalOpen: false, redirect: RedirectEnum.STAY, showReturnTop: false};
        this.classes = this.props.classes;
        this.items = [];
        this.unconfirmedSettings = { query: "", tags: new Set<RecipeTag>() };
    }
    componentDidMount() {
        window.addEventListener('resize', this.resizeListSpacing.bind(this))
        this.updateQueries();
    }

    componentDidUpdate() {
        if (this.state.redirect === RedirectEnum.UPDATE_TRIGGERED) {
            this.updateQueries({ redirect: RedirectEnum.STAY });
        }
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListSpacing.bind(this));
    }
    updateQueries(additionalState?: Partial<SearchPageState>) {
        let options = new URLSearchParams(this.props.location.search);
        let q = options.get('q');
        let tags = options.getAll('tags');
        let recipeTags = new Set(tags.filter(tag => isValidTag(tag)) as RecipeTag[]);
        let newState: SearchPageState = { ...this.state };
        if (q) {
            newState = { ...newState, query: q };
            this.unconfirmedSettings.query = q;
        }
        if (recipeTags.size > 0) {
            newState = { ...newState, selectedTags: recipeTags };
            this.unconfirmedSettings.tags = recipeTags;
        }
        http.get(`${process.env.REACT_APP_API}/recipe_data.json`, (resp) => {
            let pipeline = resp.pipe(StreamArray.withParser());
            let searchResults = new Set<JSX.Element>();
            pipeline.on('data', data => {
                let result: RecipeInfo & { id: string } = data.value;
                if (this.resultHasTags(result, newState.selectedTags) && this.searchCompare(result, newState.query) > BASE_SIMILARITY) {
                    searchResults.add(
                        <SearchResultCard
                            title={result.title}
                            id={result.id}
                            key={searchResults.size}
                            overview={result.summary}
                            tags={result.tags}
                            resultImg={result.resultImg}>
                        </SearchResultCard>
                    );
                }
            });
            pipeline.on('end', () => {
                this.items = Array.from(searchResults);
                newState = { ...newState, ...additionalState };
                this.setState(newState);
            })
        });

    }
    resultHasTags(result: RecipeInfo & { id: string }, tags: Set<RecipeTag>): boolean {
        let resultTags = new Set<RecipeTag>(result.tags);
        for (let neededTag of tags) {
            if (!resultTags.has(neededTag)) return false;
        }
        return true;
    }
    searchCompare(result: RecipeInfo & { id: string }, query: string): number {
        if (query === "") return 1;
        let maxSimilarity = -Infinity;
        let currentSimilarity: number;
        let { tags, title } = result;
        for (let t in tags) {
            currentSimilarity = this.stringSimilarity(tags[t], query);
            maxSimilarity = (currentSimilarity > maxSimilarity) ? currentSimilarity : maxSimilarity;
        }
        let titleArray:string[] = [];
        for(let i = 1; i < title.length; i ++){
            titleArray.push(title.substring(0,i+1))
        }
        for (let t in titleArray) {
            currentSimilarity = this.stringSimilarity(titleArray[t], query);
            maxSimilarity = (currentSimilarity > maxSimilarity) ? currentSimilarity : maxSimilarity;
        }
        return maxSimilarity;
    }
    editDistance(s1: string, s2: string): number {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        let costs = new Array<number>();
        for (var i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
    stringSimilarity(s1: string, s2: string): number {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        let longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / longerLength;
    }
    setModalOpen(shouldOpen: boolean) {
        this.setState({ ...this.state, modalOpen: shouldOpen });
    }
    cancelFilter() {
        this.unconfirmedSettings.query = this.state.query;
        this.unconfirmedSettings.tags = this.state.selectedTags;
        this.setModalOpen(false);
    }
    applyFilter() {
        this.setState({ ...this.state, modalOpen: false, redirect: RedirectEnum.UPDATE_SETTINGS });
    }
    resizeListSpacing() {
        listRef.current?.resetAfterIndex(0);
    }
    render() {
        if (this.state.redirect === RedirectEnum.UPDATE_SETTINGS) {
            let newQueryParams = new URLSearchParams();
            newQueryParams.append("q", this.unconfirmedSettings.query);
            this.unconfirmedSettings.tags.forEach(value => {
                newQueryParams.append("tags", value);
            });
            this.setState({ ...this.state, redirect: RedirectEnum.UPDATE_TRIGGERED });
            return <Redirect to={`/recipes?${newQueryParams.toString()}`} />;
        }
        return (
            <div className={this.classes.root} ref={topRef}>
                <div className={this.classes.results}>
                    <SearchResultCard
                        htmlId='calculatorResult'
                        className={`${this.classes.sampleResult} ${this.classes.result}`}
                        title="Sample"
                        id="sample"
                        overview="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nulla risus, congue non dignissim nec, commodo ac turpis. Morbi fringilla nunc ac lacinia facilisis. Nullam euismod at ligula quis placerat. Vestibulum fermentum ipsum ac ultrices hendrerit. Vivamus ultricies placerat feugiat. Pellentesque vestibulum massa ac urna tempor hendrerit. Sed enim elit."
                        tags={["Recommended"]}
                        resultImg="https://i.imgur.com/I86rTVl.jpg"></SearchResultCard>
                    <AutoSizer>
                        {({ height, width }) => (
                            <VariableSizeList
                                className={this.classes.list}
                                ref={listRef}
                                outerRef={outerListRef}
                                height={height}
                                width={width}
                                itemCount={this.items.length}
                                overscanCount={2}
                                innerElementType={
                                    forwardRef(({ style, ...rest }, ref) => (
                                        <div
                                            ref={ref}
                                            style={{
                                                ...style,
                                                width: `65%`
                                            }}
                                            {...rest}
                                        />
                                    ))
                                }
                                onScroll={({ scrollOffset }) => {
                                    if (scrollOffset > 0) {
                                        this.setState({ ...this.state, showReturnTop: true });
                                    } else {
                                        this.setState({ ...this.state, showReturnTop: false });
                                    }
                                }}

                                estimatedItemSize={0.25 * window.innerWidth}
                                itemSize={(index) => this.getResultHeight(index)}>
                                {({ index, style }) => {
                                    return <div className={this.classes.result} style={style}>{this.items[index]}</div>
                                }}
                            </VariableSizeList>
                        )}
                    </AutoSizer>
                </div>
                <Fab size="large" color="primary" aria-label="filter" className={`${this.classes.bigIcon} ${this.classes.filterFab}`} onClick={() => this.setModalOpen(true)}>
                    <SvgIcon component={FilterSearchIcon} viewBox="0 0 24 24"></SvgIcon>
                </Fab>
                <Zoom in={this.state.showReturnTop} >
                    <Fab size="large" color="primary" aria-label="to top" className={`${this.classes.bigIcon} ${this.classes.upFab}`} onClick={() => { outerListRef.current?.scrollTo({ behavior: "smooth", top: 0 }) }}>
                        <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                    </Fab>
                </Zoom>
                <SettingsDialog className={this.classes.filterDialog} title="Filter Search" open={this.state.modalOpen} onApply={() => this.applyFilter()} onCancel={() => this.cancelFilter()}>
                    <div className={this.classes.searchSection}>
                        <Typography>By Keyword:</Typography>
                        <SearchBar className={this.classes.searchBar} placeholder="Search Recipes..." type="fixed" callback={(value) => this.setQueryFilter(value)} initialValue={this.unconfirmedSettings.query}></SearchBar>
                    </div>
                    <div className={this.classes.tagSection}>
                        <Tooltip title="No filter applied if no tags are selected">
                            <Typography>By Tag:</Typography>
                        </Tooltip>
                        {validTags.map((tag, i) => {
                            let initialValue = false;
                            if (this.unconfirmedSettings.tags.has(tag)) {
                                initialValue = true;
                            }
                            return <TagChip variant="selector" label={tag} key={i} className={this.classes.filterTag} onSelect={(label) => this.selectTag(label)} onDeselect={(label) => this.deselectTag(label)} initialValue={initialValue} />
                        })}
                    </div>
                </SettingsDialog>
            </div>

        );
    }
    selectTag(label: RecipeTag) {
        this.unconfirmedSettings.tags.add(label);
    }
    deselectTag(label: RecipeTag) {
        this.unconfirmedSettings.tags.delete(label);
    }
    setQueryFilter(value: string) {
        this.unconfirmedSettings.query = value;
    }
    getResultHeight(index: number): number {
        let item = document.getElementById('calculatorResult') as Element;
        let compStyle = window.getComputedStyle(item);
        let heightString = item ? compStyle.height : "0px";
        let marginString = item ? compStyle.paddingTop : "0px";
        let result = parseFloat(heightString.substring(0, heightString.length - 2)) - parseFloat(marginString.substring(0, marginString.length - 2));

        return result;
    }
}
export default withRouter(withStyles(useStyles)(SearchPage));