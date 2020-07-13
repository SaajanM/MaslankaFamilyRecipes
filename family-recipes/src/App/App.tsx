import React from 'react';
import TopAppBar from './Components/TopAppBar';
import Content from './Routes/Routes';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, createStyles, WithStyles, withStyles, Theme, responsiveFontSizes, lighten } from '@material-ui/core/styles';

declare module "@material-ui/core/styles/createBreakpoints" {
  interface BreakpointOverrides {
    xxl: true; // adds the `tablet` breakpoint
    xxxl: true;
    xxxxl: true;
  }
}


const TITLE = "Maslanka Family Recipes"
let appTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary:{
      main: '#303030'
    },
    secondary: {
      main: '#ffffff'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  //spacing: factor => `${0.25 * factor}rem`,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
      xxxl: 3840,
      xxxxl: 7680
    },
  },
  overrides:{
    MuiChip:{
      outlined:{
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.23)",
        border: "initial"
      }
    }
  }
});

appTheme = responsiveFontSizes(appTheme,{breakpoints:appTheme.breakpoints.keys});

const useStyles = (theme: Theme) => {
  return createStyles({
    "App": {
      display: 'flex',
      flexDirection: 'column',
      height: "100%",
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 1)), url(\"/banner1.png\")",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em',
        height: '0.4em'
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: "#303030",
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: lighten("#303030",0.2),
        outline: '1px solid slategrey'
      }
    }
  });
};

class App extends React.Component<WithStyles<typeof useStyles>> {
  componentDidMount() {
    document.title = TITLE;
  }
  render() {
    return (
      <ThemeProvider theme={appTheme}>
        <div className={this.props.classes.App}>
          <Content>
            <TopAppBar title="Maslanka Family Recipes"></TopAppBar>
          </Content>
        </div>
      </ThemeProvider>

    );
  }
}
export default withStyles(useStyles)(App);