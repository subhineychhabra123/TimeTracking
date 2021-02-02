import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import Footer from '../common/footer'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
var controller;
var signal;
const styles = theme => ({
    card: {
        cursor: 'pointer',
        height: 150
    },
    title: {
        fontSize: 14,
    },
    noData: {
        fontSize: 30,
    },
    pos: {
        // marginBottom: 12,
    },
    paperMain: {
        marginBottom: 20,
        padding: 20,
        textAlign: 'left'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 200,
    },
    records: {

        display: 'inline-block',
        width: '32%',
        marginRight: '1%',
        textAlign: 'center',
        verticalAlign: 'middle',
        padding: 5,
        fontSize: 13
    },
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },

    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    paddingTop: {
        paddingTop: 12
    },
    padding5: {
        padding: '5px !important'
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    sortableIcon: {
        position: 'relative',
        paddingRight: '30px !important',
    },
    sortableIconContiner: {
        margin: 0,
        // position: 'absolute',
        top: '50%',
        display: 'inline-block',
        // right: 0,
        cursor: 'pointer',


    },
    sortableIconItem: {
        fontWeight: 'bold',
        fontSize: 15,
        verticalAlign: 'middle'
    },
    displayFlex: {
        display: 'flex',
    },
    flexEnd: {
        justifyContent: 'flex-end',
    },
    alignItemsCenter: { alignItems: 'center' },
    avatarImage: { width: '100% !important', height: 'auto !important' },
    customCard: {
        height: 'auto',
        minHeight: 150,
        position: 'relative',
        zIndex: 0
    },
    empName: { fontSize: 16, color: 'rgb(27, 181, 85)' },
    pos: {
        fontSize: 13,
        fontWeight: '500',
        color: '#999'
    },
    seprator: {
        textAlign: 'center',
        margin: '15px 0',
        position: 'relative'
    },
    sepratorSpan: {
        color: '#fff',
        background: '#1bb555',
        padding: ' 0px 10px',
        borderRadius: '8px',
        height: '25px',
        display: 'inline-block',
        lineHeight: '24px',
        position: 'relative',
        zIndex: 1,
        fontSize: 14
    },
    sepratorBorder: {
        background: '#1bb555',

        position: 'absolute',
        height: '1px',
        left: '15px',
        right: '15px',
        top: '50%',
    },
    nm: { margin: '0 !important' },
    values: {
        position: 'relative', marginTop: '10px'


    },
    rightSepratorContainer: {
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle'

    },
    rightSeprator: {
        position: 'absolute',
        width: 2,
        height: 50,
        background: '#c0c0c0',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    valueTitle: { fontWeight: 500 }

});
function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}



function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};
class Dashboard extends Component {
    state = {
        Employees: [],
        EmployeesList: [{ label: 'All', value: '' }],
        OrganizationSettings: {Shifts : 0, IncludeLogofToIdle : 0},
        OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
        curruntDate: '',
        SelectedEmployeeId: '',
        SelectedDate: '',
        active: true,
        single: null,
        onload: true,
        loader: true,
        listView: false,
        sortOrder: "asc",
        sortIcon: "arrow_downward",
    }
    componentWillMount() {
        controller = new AbortController();
        signal = controller.signal;
        this.props.loader(true);

        this.props.headerTitle('Time Sheet', 3);
        var body = {
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
        }
        fetch(Const.API_ROOT + Const.GET_ORGANIZATION_SETTINGS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    OrganizationSettings: responseJson['OrganizationSettings'][0],
                })
                this.getCurruntDate()
            })
            .catch((error) => {
                this.getCurruntDate()
                console.error(error);
            })
    }
    componentWillUnmount() {
        controller.abort();
    }
    setAllUserList() {
        var body = {
            OrganizationID: this.state.OrganizationID,
        }
        fetch(Const.API_ROOT + Const.GET_USERS, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                var item = {};
                responseJson['employees'].map((tile, i) => {
                    if (tile.Status === 1) {
                        item.label = tile.Name;
                        item.value = tile.EmpCode;
                        this.state.EmployeesList.push(item);
                        item = {};
                    }
                    return null;
                })
                this.setState({
                    EmployeesList: this.state.EmployeesList,
                    onload: false
                })
            })
            .catch((error) => {
                console.error(error);
            })
    }

    getTimeSheetData = () => {
        this.setState({
            Employees: [],
            loader: true
        })
        var body = {
            OrganizationID: this.state.OrganizationID,
            DateForTimeSheet: this.state.SelectedDate + ' ',
            SelectedEmployeeId: this.state.SelectedEmployeeId,
            IncludeLogofToIdle  : this.state.OrganizationSettings.IncludeLogofToIdle, 
            active: this.state.active
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_TIMING_DATA, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    loader: false
                })
                if (this.state.onload) {
                    this.setAllUserList();
                }
                if (responseJson.length) {
                    this.setState({
                        Employees: responseJson
                    })

                }
            })
            .catch((error) => {
                if (this.state.onload) {
                    //this.componentWillMount();
                    // this.setAllUserList();
                }
                this.setState({
                    loader: false
                })
                this.props.loader(false);
                console.error(error);
            })
    }
    getHours = (minutes) => {
        var hours = Math.floor(minutes / 60);
        minutes = (minutes % 60)
        if (hours < 0) {
            hours = 0;
        }
        if (minutes < 0) {
            minutes = 0;
        }
        return hours + "h " + minutes + "m";
    }
    getCurruntDate = () => {
        var todayTime = new Date();
        var month = (todayTime.getMonth() + 1);
        var day = (todayTime.getDate());
        var year = (todayTime.getFullYear());
        var curruntDate = year + "-" + month + "-" + day;
        this.setState({
            SelectedDate: curruntDate
        }, () => {
            this.getTimeSheetData();
        })
    }
    handleChange = name => value => {
        this.setState({
            [name]: value,
            SelectedEmployeeId: value.value
        }, () => {
            this.getTimeSheetData();
        });
    };
    handleDateChange = date => {
        date = new Date(date)
        var month = (date.getMonth() + 1);
        var day = (date.getDate());
        var year = (date.getFullYear());
        var CahngedDate = year + "-" + month + "-" + day;
        this.setState({
            SelectedDate: CahngedDate
        }, () => {
            this.getTimeSheetData();
        })
    };
    changeSort = () => {
        var order = "asc";
        if (this.state.sortOrder === "asc") {
            this.setState({
                sortOrder: "desc",
                sortIcon: "arrow_upward"
            })
            order = "desc";
        }
        else {
            this.setState({
                sortOrder: "asc",
                sortIcon: "arrow_downward"
            })
            order = "asc";
        }

        this.state.Employees.sort(function (a, b) {
            if (order === "asc") {
                var x = a.Name.toLowerCase();
                var y = b.Name.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            }
            else {
                x = a.Name.toLowerCase();
                y = b.Name.toLowerCase();
                if (x > y) { return -1; }
                if (x < y) { return 1; }
                return 0;
            }
        });
    }
    render() {
        const { classes } = this.props;
        const selectStyles = {
            input: base => ({
                ...base,
                '& input': {
                    font: 'inherit',
                },
            }),
        };
        return (
            <div>
                <Paper className={classes.paperMain}>
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={3} className={classes.displayFlex}>
                            <FormControl fullWidth className={classes.displayFlex}>

                                <MuiPickersUtilsProvider utils={MomentUtils} >
                                    <DatePicker
                                        keyboard
                                        label="Date"
                                        value={this.state.SelectedDate}
                                        onChange={this.handleDateChange}
                                        format={'DD/MM/YYYY'}
                                        disableOpenOnEnter
                                    />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} className={classes.displayFlex}>

                            {this.state.EmployeesList.length > 1 ? <FormControl className={classes.paddingTop} fullWidth>
                                <Select

                                    classes={classes}
                                    styles={selectStyles}
                                    options={this.state.EmployeesList}
                                    components={components}
                                    value={this.state.single}
                                    onChange={this.handleChange('single')}
                                    placeholder="Search a employee"
                                />
                            </FormControl> : ''}

                        </Grid>
                        <Grid item xs={6} sm={2} className={classes.displayFlex}>
                            <FormControl margin="normal" className={classes.sortableIconContiner} onClick={this.changeSort}>
                                <i className={`material-icons  ${classes.sortableIconItem}`}>{this.state.sortIcon}</i>
                                {this.state.sortOrder === "asc" ?
                                    <small className={classes.sortingDetail}>A-Z</small> :
                                    <small className={classes.sortingDetail}>Z-A</small>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={4} className={`${classes.displayFlex} ${classes.flexEnd}`}>
                            <FormControl  >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.active}
                                            onChange={(e) => this.setState({
                                                active: !this.state.active
                                            }, () => {
                                                this.getTimeSheetData();
                                            })}
                                            value='active'
                                            color="primary"
                                        />
                                    }
                                    label={this.state.active ? "Active" : "Inactive"}
                                />
                            </FormControl>
                            <FormControl   >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.listView}
                                            onChange={(e) => this.setState({
                                                listView: !this.state.listView
                                            })}
                                            value={this.state.listView}
                                        />
                                    }
                                    label={!this.state.listView ? "Tiles View" : "List View"}
                                />
                            </FormControl>

                        </Grid>

                    </Grid>


                </Paper>
                {this.state.loader ? '' : !this.state.listView ?
                    <Grid container spacing={16}>
                        {this.state.Employees.length ? this.state.Employees.map((data, i) => {
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                    <Card className={`${classes.card} ${classes.customCard}`} onClick={(e) => this.props.history.push('/dashboard/time-sheet-details/' + this.state.SelectedDate + '/' + data.EmpCode + '/' + data.Name)}>
                                        <CardContent>
                                            <Grid container spacing={24} className={classes.alignItemsCenter}>
                                                <Grid item xs={3} >
                                                    <Avatar alt="TechBit" src={require('../images/face1.jpg')} className={classes.avatarImage} />
                                                </Grid>
                                                <Grid className={classes.padding5} item xs={9}>
                                                    <Typography className={classes.empName} variant="title" component="h2">
                                                        {data.Name}
                                                    </Typography>
                                                    <Typography variant="caption" className={classes.pos} color="textSecondary">
                                                        {data.EmpCode}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <div className={classes.seprator}>
                                                <span className={classes.sepratorSpan}>
                                                    Hours Consumed
                                                </span>
                                                <span className={classes.sepratorBorder}></span>
                                            </div>
                                            <div className={classes.values}>
                                                <Typography className={classes.records} component="p">
                                                    <p className={`${classes.nm} ${classes.valueTitle}`}> Total </p>
                                                    <p className={classes.nm}>{data.TimeDiff ? this.getHours(data.TimeDiff) : '0'}</p>
                                                </Typography>

                                                <div className={classes.rightSepratorContainer}>
                                                    <span className={classes.rightSeprator}></span>
                                                </div>

                                                <Typography className={classes.records} component="p">
                                                    <p className={`${classes.nm} ${classes.valueTitle}`}>Idle </p>
                                                    <p className={classes.nm}>{data.IdleTime ? this.getHours(data.IdleTime) : '0'}</p>
                                                </Typography>

                                                <div className={classes.rightSepratorContainer}>
                                                    <span className={classes.rightSeprator}></span>
                                                </div>

                                                <Typography className={`${classes.nm} ${classes.records}`} component="p">
                                                    <p className={`${classes.nm} ${classes.valueTitle}`}>Actual</p>
                                                    <p className={classes.nm}>{data.ActualWork ? this.getHours(data.ActualWork) : '0'}</p>
                                                </Typography>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        }) : <Grid item xs={12}>
                                <Typography variant="h5" style={{ marginTop: 200 }} align="center" color="default">
                                    No records found!
         </Typography>
                            </Grid>
                        }
                    </Grid > : this.state.Employees.length ? <Paper>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="center">Designation</TableCell>
                                    <TableCell align="center">Hours Worked</TableCell>
                                    <TableCell align="center">Idle Time</TableCell>
                                    <TableCell align="center">Actual Work</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.Employees.map((n, j) => {
                                    return (
                                        <TableRow className={classes.tableRowHover} key={j} style={{ cursor: 'pointer' }} onClick={(e) => this.props.history.push('/dashboard/time-sheet-details/' + this.state.SelectedDate + '/' + n.EmpCode + '/' + n.Name)}>
                                            <TableCell component="th" scope="row">
                                                {n.Name}
                                            </TableCell>
                                            <TableCell align="center">{n.Designation}</TableCell>
                                            <TableCell align="center">{n.TimeDiff ? this.getHours(n.TimeDiff) : '0'}</TableCell>
                                            <TableCell align="center">{n.IdleTime ? this.getHours(n.IdleTime) : '0'}</TableCell>
                                            <TableCell align="center">{n.ActualWork ? this.getHours(n.ActualWork) : '0'}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper> : <Grid item xs={12}>
                            <Typography variant="h5" align="center" color="default">
                                No records found!
         </Typography>
                        </Grid>
                }
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(Dashboard);
