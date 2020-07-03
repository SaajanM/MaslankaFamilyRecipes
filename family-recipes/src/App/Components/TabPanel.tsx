import React from 'react';
import { Box } from '@material-ui/core';

interface TabPanelProps{
    children?: React.ReactNode;
    dir?: string;
    value: number;
    index: number;
    [key:string]: any;
}

export default class TabPanel extends React.Component<TabPanelProps> {
    private children?: React.ReactNode;
    private dir?: string;
    private value:number;
    private index:number;
    private other:any;
    constructor(props:TabPanelProps) {
        super(props);
        let {children,dir,value,index, ...other} = this.props;
        this.children = children;
        this.dir = dir;
        this.value = value;
        this.index = index;
        this.other = other;
    }
    render() {
        return (
            <div
                role="tabpanel"
                hidden={this.value !== this.index}
                id={`full-width-tabpanel-${this.index}`}
                aria-labelledby={`full-width-tab-${this.index}`}
                {...this.other}
            >
                {this.value === this.index && (
                    <Box p={3}>
                        {this.children}
                    </Box>
                )}
            </div>
        );
    }
}