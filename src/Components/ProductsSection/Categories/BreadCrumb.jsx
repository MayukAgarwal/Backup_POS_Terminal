import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import { connect } from 'react-redux';
import { commonActionCreater } from '../../../Redux/commonAction';
import _get from 'lodash/get';

const styles = theme => ({
  root: {
    padding: '5px',
  },
  chip: {
    // backgroundColor: theme.palette.grey[100],
    height: 20,
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing.unit * 1.5,
  },
});

function CustomBreadcrumb(props) {
  const { classes, ...rest } = props;
  return <Chip className={classes.chip} {...rest} />;
}

CustomBreadcrumb.propTypes = {
  classes: PropTypes.object.isRequired,
};

const StyledBreadcrumb = withStyles(styles)(CustomBreadcrumb);

class CustomizedBreadcrumbs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidUpdate() {
    if (this.props.resetCategory == true) {
      this.props.getHotProductFromPouch()
      this.setState({ clearCategory: true });
      this.props.dispatch(commonActionCreater(false, 'RESET_CATEGORY'));
    }
  }
  render() {
    const { classes, selectedRootCategory, selectedSubCategory, selectedLeafCategory, selectedCurrentCategory } = this.props;
    let props = this.props;
    const {clearCategory} = this.state
    return (
      <Paper className={classes.root}>
        <Breadcrumbs arial-label="Breadcrumb">

          <StyledBreadcrumb
            label="Home"
            avatar={
              <Avatar className={classes.avatar}>
                <HomeIcon />
              </Avatar>}
            onClick={() => props.homeClickHandler()}
          />
            {selectedCurrentCategory.categoryType >= 0 && <StyledBreadcrumb label={selectedRootCategory.name} onClick={() => props.categoryClickHandler(selectedRootCategory)} />}
            {selectedCurrentCategory.categoryType >= 1 && <StyledBreadcrumb label={selectedSubCategory.name} onClick={() => props.categoryClickHandler(selectedSubCategory)} />}
            {selectedCurrentCategory.categoryType >= 2 && <StyledBreadcrumb label={selectedLeafCategory.name} />}
        </Breadcrumbs>
      </Paper>
    );
  }
}

CustomizedBreadcrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  let resetCategory = _get(state, 'resetCategory.lookUpData')
  return { resetCategory }
}

export default connect(mapStateToProps)(withStyles(styles)(CustomizedBreadcrumbs));