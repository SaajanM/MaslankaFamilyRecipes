import React from 'react';
import TopAppBar from './Components/TopAppBar';
import Content from './Routes/Routes';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, createStyles, WithStyles, withStyles, Theme } from '@material-ui/core/styles';

const TITLE = "Maslanka Family Recipes"
const appTheme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: '#ffffff'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});
const useStyles = (theme: Theme) => {
  return createStyles({
    "App": {
      display: 'flex',
      flexDirection: 'column',
      height: "100%",
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 1)), url(\"banner1.png\")",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.4em'
      },
      '*::-webkit-scrollbar-track': {
        'background-color': 'rgba(0,0,0,0.1)',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.2)',
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