import React, { Component } from 'react';
import Const from '../common/constant'
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { DateRangePicker } from 'react-dates';
import EmployeesDropDown from '../common/employeeDropDown'
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { DatePicker } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';
import { NotificationManager } from 'react-notifications';
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';
import Footer from '../common/footer'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

var moment = require('moment');
var controller;
var signal;
const styles = {
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        color: '#fff'
    },
    active: {
        background: '#22b14c'
    },
    inActive: {
        background: '#00a2e8'
    },
    total: {
        background: '#ff7f27'
    },
    paper: {
        marginTop: 30,
        padding: 20,
    },

};

class Dashboard extends Component {
    _isMounted = false;
    state = {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        pageLoaded: false,
        loadEmployeeGraph: false,
        employeeReport: [],
        employeesTimeSheet: [],
        SelectedDate: moment().format("YYYY-M-DD"),
        SelectedDateForAttendance: moment().subtract(1, 'd').format("YYYY-M-DD"),
        selectedValueRadio: 'TimeDiff',
        sheetData: [],
        startDate: moment().subtract(7, 'd'),
        endDate: moment(),
        attendance: [],
        showAttendanceDialog: false,
        AttendanceDialogData: [],
        AttendanceSelectedForDetails: "",
        OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
        OrganizationSettings: { Shifts: 0, IncludeLogofToIdle: 0 },
    }
    componentWillMount() {
        controller = new AbortController();
        signal = controller.signal;
        this._isMounted = true;
        this.props.headerTitle('Dashboard', 1);
        setTimeout(
            function () {
                var body = {
                    OrganizationID: this.state.OrganizationID
                }
                this.props.loader(true);
                if (this._isMounted) {
                    fetch(Const.API_ROOT + Const.GET_Employees_Status, {
                        method: 'POST',
                        headers: Const.API_HEADER,
                        body: JSON.stringify(body),
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            // this.props.loader(false);
                            var active = 0;
                            var inactive = 0;
                            responseJson.map(function (row) {
                                if (row.Status == 0)
                                    inactive = row.StatusCount
                                else
                                    active = row.StatusCount
                            })

                            this.setState({
                                totalEmployees: inactive + active,
                                inactiveEmployees: inactive,
                                activeEmployees: active,
                            })

                            // this.setState({
                            //     totalEmployees: responseJson.length > 1 ? responseJson[0].StatusCount + responseJson[1].StatusCount : responseJson[0].StatusCount,
                            //     inactiveEmployees: responseJson[0].StatusCount,
                            //     activeEmployees: responseJson[1] ? responseJson[1].StatusCount : 0,
                            // })

                            this.props.loader(false);
                            this.getOrganizationSettings(true);
                            // var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
                            // if (SelectedEmployeeIdForCart) {
                            //     this.setState({
                            //         SelectedEmployeeId: SelectedEmployeeIdForCart
                            //     }, () => {
                            //         this.getEmployeeReport(true, localStorage.getItem('SelectedEmployeeNameForCart'));
                            //     })
                            // } else {
                            //     this.getTimeSheetData(true);
                            // }
                        })
                        .catch((error) => {
                            console.error(error);
                            this.props.loader(false);
                            this.getOrganizationSettings(true);
                            // var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
                            // if (SelectedEmployeeIdForCart) {
                            //     this.setState({
                            //         SelectedEmployeeId: SelectedEmployeeIdForCart
                            //     }, () => {
                            //         this.getEmployeeReport(true, localStorage.getItem('SelectedEmployeeNameForCart'));
                            //     })
                            // } else {
                            //     this.getTimeSheetData(true);
                            // }
                        })
                }
            }.bind(this), 500);
    }



    componentWillUnmount = () => {
        controller.abort();
        this._isMounted = false;
    }
    getParentStatus = () => {
        return this._isMounted;
    }
    selectEmployee(SelectedEmployeeId, label) {
        this.setState({
            SelectedEmployeeId: SelectedEmployeeId,
            selectedEmployeeName: label
        }, () => {
            this.getEmployeeReport('', label);
        })
    }
    changeRange(startDate, endDate) {
        this.setState({
            startDate: startDate,
            endDate: endDate
        }, () => {
            if (this.state.SelectedEmployeeId) {
                this.getEmployeeReport();
            }
        })
    }
    getOrganizationSettings(onload) {
        var body = {
            OrganizationID: JSON.parse(localStorage.getItem('loggedInUserDetails')).OrganizationID,
        }
        this.props.loader(true);
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
                var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
                if (SelectedEmployeeIdForCart) {
                    this.setState({
                        SelectedEmployeeId: SelectedEmployeeIdForCart
                    }, () => {
                        this.getEmployeeReport(true, localStorage.getItem('SelectedEmployeeNameForCart'));
                    })
                } else {
                    this.getTimeSheetData(true);
                }
            })
            .catch((error) => {
                this.props.loader(false);
                var SelectedEmployeeIdForCart = localStorage.getItem('SelectedEmployeeIdForCart');
                if (SelectedEmployeeIdForCart) {
                    this.setState({
                        SelectedEmployeeId: SelectedEmployeeIdForCart
                    }, () => {
                        this.getEmployeeReport(true, localStorage.getItem('SelectedEmployeeNameForCart'));
                    })
                } else {
                    this.getTimeSheetData(true);
                }
                console.error(error);
            })
    }

    getEmployeeReport(onload, label) {
        if (!this.state.startDate) {
            NotificationManager.error('Error', 'Select start date first!.');
            return false;
        }
        if (!this.state.endDate) {
            NotificationManager.error('Error', 'Select end date first!.');
            return false;
        }
        if (!this.state.SelectedEmployeeId) {
            NotificationManager.error('Error', 'Select employee  first!.');
            return false;
        }
        var body = {
            OrganizationID: this.state.OrganizationID,
            EmployeeId: this.state.SelectedEmployeeId,
            IncludeLogofToIdle  : this.state.OrganizationSettings.IncludeLogofToIdle, 
            StartDate: this.state.startDate.format("YYYY-MM-DD") + ' ',
            EndDate: this.state.endDate.format("YYYY-MM-DD") + ' '
            // StartDate: this.state.startDate.format("YYYY-MM-DD") + ' 00:00:00',
            // EndDate: this.state.endDate.format("YYYY-MM-DD") + ' 23:59:59'
        }
        this.props.loader(true);
        if (this._isMounted) {
            fetch(Const.API_ROOT + Const.GET_EMPLOYEE_REPORT, {
                method: 'POST',
                headers: Const.API_HEADER,
                body: JSON.stringify(body),
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (onload) {
                        this.getTimeSheetData(onload);
                    }
                    this.props.loader(false);
                    localStorage.setItem('SelectedEmployeeIdForCart', this.state.SelectedEmployeeId);
                    if (label) {
                        localStorage.setItem('SelectedEmployeeNameForCart', label)
                    }
                    responseJson = responseJson;
                    this.setEmployeeReportGraph(responseJson);
                })
                .catch((error) => {
                    this.props.loader(false);
                    if (onload) {
                        this.getTimeSheetData(onload);
                    }
                })
        }
    }
    getTimeSheetData = (onload) => {
        var body = {
            OrganizationID: this.state.OrganizationID,
            DateForTimeSheet: this.state.SelectedDate + ' ',
            IncludeLogofToIdle  : this.state.OrganizationSettings.IncludeLogofToIdle, 
            SelectedEmployeeId: '',
            active: true
        }
        this.props.loader(true);
        if (this._isMounted) {
            fetch(Const.API_ROOT + Const.GET_TIMING_DATA, {
                method: 'POST',
                headers: Const.API_HEADER,
                body: JSON.stringify(body),
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.props.loader(false);
                    if (onload) {
                        this.getAttendance();
                    }
                    this.setState({
                        sheetData: responseJson
                    }, () => {
                        this.setTimeSheet();
                    })

                })
                .catch((error) => {
                    console.error(error);
                    if (onload) {
                        this.getAttendance();
                    }

                })
        }
    }
    getAttendance = () => {
        this.setState({
            attendance: []
        })
        var body = {
            OrganizationID: this.state.OrganizationID,
            DateForAttendance: this.state.SelectedDateForAttendance,
        }
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_ATTENDANCE, {
            method: 'POST',
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                var att = [];
                var presentCount = 0;
                var absentCount = 0;
                var presentEmp = [];
                var absentEmp = [];
                responseJson.map(x => {
                    if (x.Present == 1) {
                        presentEmp.push(x.name);
                        presentCount++;
                    }
                    else if (x.Present == 0) {
                        absentEmp.push(x.name);
                        absentCount++
                    }
                });
                att.push({ name: 'Present', value: presentCount, empNames: presentEmp, color: '#1bb555' })
                att.push({ name: 'Absent', value: absentCount, empNames: absentEmp, color: '#f00b00' })
                this.setState({
                    attendance: att,
                    pageLoaded: true,
                })
            })
            .catch((error) => {
                this.props.loader(false);
                this.setState({
                    pageLoaded: true,

                })
            })
    }
    setTimeSheet() {
        var item = {};
        this.setState({
            employeesTimeSheet: [],
            loadTimeSheetGraph: false
        }, () => {
            this.state.sheetData.map((data, i) => {
                item = {};
                item['name'] = data.Name;
                if (this.state.selectedValueRadio === 'TimeDiff') {
                    item['Total'] = this.getHours(data.TimeDiff)
                } else if (this.state.selectedValueRadio === 'IdleTime') {
                    item['Idle'] = this.getHours(data.IdleTime)
                } else {
                    item['Actual'] = this.getHours(data.ActualWork)
                }
                this.state.employeesTimeSheet.push(item);
                return null;
            })
            this.setState({
                employeesTimeSheet: this.state.employeesTimeSheet,
                loadTimeSheetGraph: true
            })
        })

    }
    setEmployeeReportGraph(responseJson) {
        var item = {};
        this.setState({
            employeeReport: [],
            loadEmployeeGraph: false
        })
        responseJson.map((data, i) => {
            item = {};
            item['name'] = data.ScreenDate;
            item['Total'] = this.getHours(data.TotalWorkTime);
            item['Idle'] = this.getHours(data.IdleTime);
            item['Actual'] = this.getHours(data.ActualWork);
            this.state.employeeReport.push(item)
            return null;
        })
        this.setState({
            employeeReport: this.state.employeeReport,
            loadEmployeeGraph: true
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
        return hours + "." + minutes;
    }
    handleChange = event => {
        this.setState({ selectedValueRadio: event.target.value }, () => {
            this.setTimeSheet();
        });
    };
    handleDateChange = date => {
        var CahngedDate = moment(date).format("YYYY-M-DD")
        this.setState({
            SelectedDate: CahngedDate
        }, () => {
            this.getTimeSheetData();
        })
    };
    handleAttendanceDateChange = date => {
        var CahngedDate = moment(date).format("YYYY-M-DD")
        this.setState({
            SelectedDateForAttendance: CahngedDate
        }, () => {
            this.getAttendance();
        })
    };
    showAttendanceDialog = (value, index) => {
        var data = this.state.attendance.filter(x => x.name == value);
        this.setState({
            showAttendanceDialog: true,
            AttendanceDialogData: data[0].empNames,
            AttendanceSelectedForDetails: value,
        })
    }
    closeAttendanceDialog = () => {
        this.setState({
            showAttendanceDialog: false
        });
    };
    render() {
        const { text } = this.props;
        const { classes } = this.props;
        return (
            <div>
                <Grid container spacing={16}>

                    <Grid item xs={12} sm={3} >
                        <Card className={`${classes.card} ${classes.active}`}>
                            <CardContent >
                                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                                    {this.state.activeEmployees}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Active Employees
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <Card className={`${classes.card} ${classes.inActive}`}>

                            <CardContent>
                                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                                    {this.state.inactiveEmployees}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Inactive Employees
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <Card className={`${classes.card} ${classes.total}`}>
                            <CardContent>
                                <Typography style={{ color: '#fff' }} variant="h5" component="h2">
                                    {this.state.totalEmployees} {text}
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    Total Employees
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Typography style={{ marginTop: 30 }} variant="headline" component="h2">
                    Performance Charts
                </Typography>
                <Typography variant="subtitle1" component="h2">
                    Employees
                </Typography>
                <Paper className={classes.paper}>
                    <Typography variant="title" component="h2">
                        Hours in Office vs Hours Worked Graph
                    </Typography>
                    <Grid container spacing={24} style={{ margin: 15 }}>
                        <Grid item xs={12} sm={4} className={classes.filterDiv}>
                            <DateRangePicker
                                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                onDatesChange={({ startDate, endDate }) => this.changeRange(startDate, endDate)}  // PropTypes.func.isRequired,
                                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                isOutsideRange={() => false}
                            />
                        </Grid>
                        <Grid container item xs={12} sm={6} style={{ padding: 0 }}>
                            <Grid item xs={12} sm={6} >
                                {this.state.pageLoaded ? <EmployeesDropDown getParentStatus={this.getParentStatus.bind(this)} id={this.state.SelectedEmployeeId} selectEmployee={this.selectEmployee.bind(this)} /> : <span>Loading...</span>}
                            </Grid>
                        </Grid>
                    </Grid>
                    {!localStorage.getItem('SelectedEmployeeIdForCart') ?
                        <Typography variant="headline" component="h2" style={{ textAlign: "center", padding: 15 }}>
                            Please select any employee to render chart!

                        </Typography> : this.state.loadEmployeeGraph ?
                            <ResponsiveContainer width="100%" height={350}><BarChart data={this.state.employeeReport}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Total" fill="#8884d8" />
                                <Bar dataKey="Idle" fill="#f40b0080" />
                                <Bar dataKey="Actual" fill="#22b14c" />
                            </BarChart></ResponsiveContainer> : <div></div>
                    }

                </Paper>
                <Paper className={classes.paper} style={{ marginBottom: 50 }}>
                    <Typography variant="title" component="h2">
                        All employees daily time sheet
                    </Typography>
                    <Grid container spacing={24} style={{ margin: 15 }}>
                        <Grid item xs={12} sm={3}>
                            <FormControl margin="normal" fullWidth>

                                <MuiPickersUtilsProvider utils={MomentUtils}>
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
                        <Grid container item xs={12} sm={5} style={{ paddingTop: 35 }}>
                            <Grid item xs={12} sm={4}>
                                <InputLabel >Total Work</InputLabel>
                                <Radio
                                    checked={this.state.selectedValueRadio === 'TimeDiff'}
                                    onChange={this.handleChange}
                                    value="TimeDiff"
                                    name="radio-button-demo"
                                    aria-label="A"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel >Idle Time</InputLabel>
                                <Radio
                                    checked={this.state.selectedValueRadio === 'IdleTime'}
                                    onChange={this.handleChange}
                                    value="IdleTime"
                                    name="radio-button-demo"
                                    aria-label="B"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <InputLabel >Actual Work</InputLabel>
                                <Radio
                                    checked={this.state.selectedValueRadio === 'ActualWork'}
                                    onChange={this.handleChange}
                                    value="ActualWork"
                                    name="radio-button-demo"
                                    aria-label="C"
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {this.state.loadTimeSheetGraph ? <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={this.state.employeesTimeSheet}
                            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" interval={0} textAnchor="end" angle={-85} dy={0} style={{ marginTop: 50 }} />
                            <YAxis />
                            <Tooltip />
                            {/* <Legend /> */}
                            {this.state.selectedValueRadio === 'TimeDiff' ? <Bar dataKey="Total" fill="#8884d8" /> : this.state.selectedValueRadio === 'IdleTime' ? <Bar dataKey="Idle" fill="#f40b0080" /> : this.state.selectedValueRadio === 'ActualWork' ? <Bar dataKey="Actual" fill="#22b14c" /> : ''}
                        </BarChart></ResponsiveContainer> : ''
                    }
                </Paper>
                <Paper className={classes.paper} style={{ marginBottom: 50 }}>
                    <Typography variant="title" component="h2">
                        Employees Attendance Chart
                    </Typography>
                    <Grid container spacing={24} style={{ margin: 15 }}>
                        <Grid item xs={12} sm={3}>
                            <FormControl margin="normal" fullWidth>

                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        keyboard
                                        label="Date"
                                        value={this.state.SelectedDateForAttendance}
                                        onChange={this.handleAttendanceDateChange}
                                        format={'DD/MM/YYYY'}
                                        maxDate={moment().subtract(1, 'd')}
                                        disableOpenOnEnter
                                    />
                                </MuiPickersUtilsProvider>

                            </FormControl>
                        </Grid>

                    </Grid>
                    <ResponsiveContainer width={'100%'} height={420}>
                        <PieChart width={400} height={400} onMouseEnter={this.onPieEnter} >
                            <Legend verticalAlign="top" height={36} />
                            <Pie dataKey="value" data={this.state.attendance} cx={'auto'} cy={150} labelLine={false} label={renderCustomizedLabel}
                                outerRadius={150} fill="#8884d8">

                                {this.state.attendance.map((entry, index) => <Cell style={{ cursor: 'pointer' }} fill={entry.color} key={index} onClick={(d, i) => this.showAttendanceDialog(entry.name)} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                </Paper>
                <Dialog open={this.state.showAttendanceDialog}
                    onClose={this.closeAttendanceDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`List of ${this.state.AttendanceSelectedForDetails} Employees`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.AttendanceDialogData.map((entry, index) =>
                                <p key={index}>{entry}</p>)}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAttendanceDialog} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Footer />
            </div>
        );
    }
}
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {value + ' ' + name}
        </text>
    );
};
export default withStyles(styles)(Dashboard);
