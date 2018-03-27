import { Theme } from 'material-ui';
import returnof from 'returnof';

const DrawerWidth = 240;
const DrawerWidthSmall = 56;
const AppBarHeight = 64;
const AppBarHeightSm = 56;
const FooterHeight = 32;

export const Styles = (theme: Theme) => {
  const PaddingHeight = theme.spacing.unit * 6;
  const PaddingHeightSm = theme.spacing.unit * 2;

  const ContentHeightSubtract = AppBarHeight + PaddingHeight + FooterHeight;
  const ContentHeightSubtractSm = AppBarHeightSm + PaddingHeightSm + FooterHeight;

  const ContentHeightSubtractNoAppBar = PaddingHeight + FooterHeight;
  const ContentHeightSubtractNoAppBarSm = PaddingHeightSm + FooterHeight;

  return {
    appFrame: {
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
    } as React.CSSProperties,

    appBar: {
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    } as React.CSSProperties,

    appBarShift: {
      marginLeft: DrawerWidthSmall,
      width: `calc(100% - ${DrawerWidthSmall}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        marginLeft: DrawerWidth,
        width: `calc(100% - ${DrawerWidth}px)`,
      },
    } as React.CSSProperties,

    menuButton: {
      marginLeft: theme.spacing.unit / 2,
      marginRight: theme.spacing.unit / 2,
      color: '#fff',
    } as React.CSSProperties,

    hide: {
      display: 'none',
    } as React.CSSProperties,

    drawerPaper: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: DrawerWidthSmall,
      border: 'none',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        width: DrawerWidth,
      },
    } as React.CSSProperties,

    drawerPaperClose: {
      width: 0,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('sm')]: {
        width: DrawerWidthSmall,
      },
    } as React.CSSProperties,

    drawerInner: {
      // Make the items inside not wrap when transitioning:
      width: DrawerWidth,
    } as React.CSSProperties,

    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      height: AppBarHeightSm,
      [theme.breakpoints.up('sm')]: {
        height: AppBarHeight,
        justifyContent: 'flex-end',
      },
      // ...theme.mixins.toolbar,
    } as React.CSSProperties,

    content: {
      width: '100%',
      flexGrow: 1,
      padding: theme.spacing.unit,
      overflowY: 'auto',
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing.unit * 3,
      },
    } as React.CSSProperties,

    contentAppBar: {
      height: `calc(100% - ${ContentHeightSubtractSm}px)`,
      marginTop: 56,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${ContentHeightSubtract}px)`,
        marginTop: 64,
      },
    } as React.CSSProperties,

    contentNoAppBar: {
      height: `calc(100% - ${ContentHeightSubtractNoAppBarSm}px)`,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${ContentHeightSubtractNoAppBar}px)`,
      },
    } as React.CSSProperties,

    contentDrawer: {
      width: '100%',
      marginLeft: 0,

      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DrawerWidthSmall}px)`,
        marginLeft: DrawerWidthSmall,
      },
    } as React.CSSProperties,

    contentNoDrawer: {

    } as React.CSSProperties,

    title: {
      color: 'white',
      textDecoration: 'none',
    } as React.CSSProperties,

    toolbar: {
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing.unit * 3,
      },
    } as React.CSSProperties,

    toolbarShift: {
      paddingLeft: theme.spacing.unit * 2,
    } as React.CSSProperties,

    toolbarRight: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      overflow: 'hidden',
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit * 2,
      [theme.breakpoints.up('sm')]: {
        marginRight: 0,
      },
    } as React.CSSProperties,

    toolbarButtons: {
      display: 'flex',
      flexDirection: 'row-reverse',
    } as React.CSSProperties,

    list: {

    } as React.CSSProperties,

    listItem: {

    } as React.CSSProperties,

    listItemText: {
      padding: 0,
    } as React.CSSProperties,

    footer: {
      height: 32,
      lineHeight: '32px',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: 10000,
      background: 'transparent',
      color: theme.palette.getContrastText(theme.palette.common.black),
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    } as React.CSSProperties,

    highlight: {
      background: '#eee',
    },

    noHighlight: {

    },

    button: {
      margin: `0 0 0 ${theme.spacing.unit * 2}px`,
    },

    loginInfo: {
      alignSelf: 'center',
      color: '#fff',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      paddingRight: theme.spacing.unit,
    } as React.CSSProperties,

    envInfo: {
      color: '#aaa',
      marginLeft: theme.spacing.unit,
    } as React.CSSProperties,

    demoInfo: {
      color: '#f00',
      marginLeft: theme.spacing.unit,
    },

    desktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    } as React.CSSProperties,

    mobile: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    } as React.CSSProperties,
  };
};

const stylesReturn = returnof(Styles);

export type ClassNames = keyof typeof stylesReturn;
