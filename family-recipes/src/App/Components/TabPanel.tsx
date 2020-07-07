import React from 'react';

interface TabPanelProps {
    dir?: string;
    value: number;
    index: number;
}

export default class TabPanel extends React.Component<TabPanelProps> {
    render() {
        return (
            <div
                role="tabpanel"
                style={{
                    display: this.props.index === this.props.value ? "flex" : "none",
                    flexDirection: 'column'
                }}
                id={`full-width-tabpanel-${this.props.index}`}
                aria-labelledby={`full-width-tab-${this.props.index}`}
            >
                {this.props.children}
            </div>
        );
    }
}