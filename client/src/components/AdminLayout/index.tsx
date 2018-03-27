import * as _ from 'lodash';
import * as React from 'react';
import { AppBar, Toolbar, Typography, withStyles, Drawer, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, WithStyles, Menu, MenuItem } from 'material-ui';
import * as classNames from 'classnames';
import { ButtonInfo, IconKey, CommonProps } from '../../types';
import MenuIcon from 'material-ui-icons/Menu';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import { Links, LinkDefinition } from '../../links';
import { IconLink } from '../IconLink';
import { ButtonLink } from '../ButtonLink';
import { Link } from '../Link';
import { Styles, ClassNames } from './style';

interface Props extends CommonProps {
  title: string | null;
  toolbarButtons: (ButtonInfo | null)[];
  children: React.ReactNode;
  icon?: IconKey;
}

export const AdminLayout = withStyles(Styles)(
  (props: Props & WithStyles<ClassNames>) => {
    function toggleDraw() {
      props.app.onToggleDraw();
    }

    async function onLinkClick() {
      await props.app.assertDirty();

      props.app.onToggleDraw(false);
    }

    function getLinks() {
      const { authenticatedUser } = props.app;

      function canViewLink(link: LinkDefinition) {
        const userRole = authenticatedUser && authenticatedUser.role || 'Anon';

        return link.roles.indexOf(userRole) !== -1;
      }

      return Links.filter(canViewLink).map((link) => (
        <ListItem button key={link.path} title={link.title} component={(props) => <li className={classes.listItem}><Link {...props} onClick={onLinkClick} to={link.path} /></li>}>
          <ListItemIcon>
            {link.icon}
          </ListItemIcon>
          <ListItemText primary={link.title} className={classes.listItemText} />
        </ListItem>
      ));
    }

    function getAppBarColour() {
      return '#393939';
    }

    function logout() {
      // props.onDemoLogin(null);
    }

    function getToolbarButtons() {
      return (
        <div className={classNames(classes.toolbarButtons, classes.desktop)}>
          {
            props.toolbarButtons.map((button, index) => {
              return (
                button ?
                  <ButtonLink
                    key={index}
                    colour={button.colour}
                    to={button.to}
                    className={props.classes.button}
                    onClick={() => button.onClick && button.onClick()}>
                    {button.label}
                  </ButtonLink>
                  : null
              );
            })
          }
        </div>
      );
    }

    function getToolbarButtonsMobile() {
      return (
        <div className={classNames(classes.toolbarButtons, classes.mobile)}>
          <SimpleMenu>
            {
              props.toolbarButtons.map((button, index) => {
                return (
                  button ?
                    <ButtonLink
                      key={index}
                      colour={button.colour}
                      to={button.to}
                      className={props.classes.button}
                      style={{ margin: '0 auto' }}
                      onClick={() => button.onClick && button.onClick()}>
                      {button.label}
                    </ButtonLink>
                    : null
                );
              }).filter(((button) => !!button) as (button: JSX.Element | null) => button is JSX.Element)
            }
          </SimpleMenu>
        </div>
      );
    }

    function showAppBar() {
      return true; // !!authenticatedUser;
    }

    function showSidebar() {
      return true; // !!authenticatedUser;
    }

    const { app, title, children, classes } = props;

    const { bootstrap, authenticatedUser, drawerOpen } = app;

    if (!classes) return null;

    return (
      <div className={classes.appFrame}>

        {
          showAppBar() &&
          <AppBar className={classNames(classes.appBar, drawerOpen && classes.appBarShift)} style={{ backgroundColor: getAppBarColour() }}>

            <Toolbar className={classNames(classes.toolbar, drawerOpen && classes.toolbarShift)} disableGutters={true}>

              <IconButton
                aria-label='open drawer'
                onClick={() => toggleDraw()}
                className={classNames(classes.menuButton, drawerOpen && classes.hide)}>
                <MenuIcon />
              </IconButton>

              <Typography variant='title' color='inherit'>
                <Link className={classNames(classes.title, classes.desktop)} to='/'>{title ? `Entry System - ${title}` : 'Entry System'}</Link>
                <Link className={classNames(classes.title, classes.mobile)} to='/'>{title || 'ES'}</Link>
              </Typography>

              <div className={classes.toolbarRight}>

                {getToolbarButtons()}

                {getToolbarButtonsMobile()}

                {
                  authenticatedUser &&
                  <Typography className={classes.loginInfo}>
                    {authenticatedUser.name}
                  </Typography>
                }
              </div>

            </Toolbar>

          </AppBar>
        }

        {
          showSidebar() &&
          <Drawer
            variant='permanent'
            classes={{
              paper: classNames(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
            }}
            open={drawerOpen}>

            <div className={classes.drawerInner}>
              <div className={classes.drawerHeader}>
                <IconLink type='chevron' tooltip='Toggle Sidebar' onClick={() => toggleDraw()} />
              </div>

              <Divider />

              <List className={classes.list}>
                {getLinks()}
              </List>

              <Divider />

              {
                authenticatedUser &&
                <List className={classes.list}>
                  <ListItem button onClick={() => logout()} className={classes.listItem}>
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.listItemText}
                      primary={
                        <span dangerouslySetInnerHTML={{ __html: `Logout ${authenticatedUser.name.replace(/ /g, '&nbsp;')}` }} />
                      } />
                  </ListItem>
                </List>
              }
            </div>

          </Drawer>
        }

        <main className={classNames(classes.content, showAppBar() ? classes.contentAppBar : classes.contentNoAppBar, showSidebar() ? classes.contentDrawer : classes.contentNoDrawer)}>
          {children}
        </main>

        <footer className={classes.footer}>
          <span>Entry System</span>
          {
            bootstrap.env !== 'production' &&
            <span className={classes.envInfo}>{_.capitalize(bootstrap.env)} Mode</span>
          }
          {
            bootstrap.demoMode &&
            <span className={classes.demoInfo}>DEMO</span>
          }
        </footer>

      </div>
    );
  },
);

class SimpleMenu extends React.Component<{ children: JSX.Element[] }, { anchorEl?: HTMLElement, menuOpen: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      menuOpen: false,
    };
  }

  handleClick = (event: React.SyntheticEvent<{}>) => {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget as HTMLElement });
  }

  handleRequestClose = () => {
    this.setState({ menuOpen: false });
  }

  render() {
    if (this.props.children.length === 0) return null;

    return (
      <div>
        <IconLink
          tooltip='actions'
          type='more'
          aria-owns={this.state.menuOpen ? 'simple-menu' : null}
          aria-haspopup='true'
          shrinkWrap={true}
          style={{ color: '#fff', background: '#2DB4AC', width: 24, height: 24, display: 'block', borderRadius: '12px' }}
          onClick={this.handleClick} />

        <Menu
          id='simple-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.menuOpen}
          onClose={this.handleRequestClose}>

          {
            this.props.children.map((child, index) => (
              <MenuItem key={index} style={{ height: 'auto' }}>
                {child}
              </MenuItem>
            ))
          }

          {/* <MenuItem component={() => <ButtonLink to='/'>Hello</ButtonLink>} />
          <MenuItem onClick={this.handleRequestClose}>My account</MenuItem>
          <MenuItem onClick={this.handleRequestClose}>Logout</MenuItem> */}
        </Menu>
      </div>
    );
  }
}
