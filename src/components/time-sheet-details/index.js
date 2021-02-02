import React, { Component } from "react";
import Const from "../common/constant";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as d3 from "d3";
import Grid from "@material-ui/core/Grid";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { LinearProgress, TableCell, TableRow } from "@material-ui/core";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import Footer from "../common/footer";
import EmployeesDropDown from "../common/employeeDropDown";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { DatePicker } from "material-ui-pickers";
import SimpleDialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Line } from "rc-progress";
var controller;
var signal;
var moment = require("moment");

const ReplacementImage =
    "data:image/png;base64,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";
function arrowGenerator(color) {
    return {
        '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            marginTop: "-0.9em",
            width: "3em",
            height: "1em",
            "&::before": {
                borderWidth: "0 1em 1em 1em",
                borderColor: `transparent transparent ${color} transparent`,
            },
        },
        '&[x-placement*="top"] $arrow': {
            bottom: 0,
            left: 0,
            marginBottom: "-0.9em",
            width: "3em",
            height: "1em",
            "&::before": {
                borderWidth: "1em 1em 0 1em",
                borderColor: `${color} transparent transparent transparent`,
            },
        },
        '&[x-placement*="right"] $arrow': {
            left: 0,
            marginLeft: "-0.9em",
            height: "3em",
            width: "1em",
            "&::before": {
                borderWidth: "1em 1em 1em 0",
                borderColor: `transparent ${color} transparent transparent`,
            },
        },
        '&[x-placement*="left"] $arrow': {
            right: 0,
            marginRight: "-0.9em",
            height: "3em",
            width: "1em",
            "&::before": {
                borderWidth: "1em 0 1em 1em",
                borderColor: `transparent transparent transparent ${color}`,
            },
        },
    };
}
const styles = (theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
        marginBottom: 30,
    },
    paper: {
        textAlign: "center",
        color: theme.palette.text.secondary,
        cursor: "pointer",
        padding: 5,
        marginBottom: 10,
    },
    NoUserPaper: {
        backgroundColor: "red",
    },
    image: {
        width: "100%",
        height: 96,
    },
    loaderDiv: {
        padding: 30,
        width: "100%",
        height: 100,
    },
    linearBarColorPrimary: {
        backgroundColor: "green",
    },
    titleDiv: {
        padding: 5,
    },
    backgroundYellow: {
        backgroundColor: "yellow",
        padding: 5,
    },
    backgroundRed: {
        backgroundColor: "red",
        padding: 5,
    },
    lightTooltip: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
    arrowPopper: arrowGenerator(theme.palette.grey[700]),
    arrow: {
        position: "absolute",
        fontSize: 7,
        width: "3em",
        height: "3em",
        "&::before": {
            content: '""',
            margin: "auto",
            display: "block",
            width: 0,
            height: 0,
            borderStyle: "solid",
        },
    },
    bootstrapPopper: arrowGenerator(theme.palette.common.black),
    bootstrapTooltip: {
        backgroundColor: theme.palette.common.black,
    },
    bootstrapPlacementLeft: {
        margin: "0 8px",
    },
    bootstrapPlacementRight: {
        margin: "0 8px",
    },
    bootstrapPlacementTop: {
        margin: "8px 0",
    },
    bootstrapPlacementBottom: {
        margin: "8px 0",
    },
    DatePicker: {
        marginTop: 4,
    },
    loadingEmloyeesList: {
        paddingTop: 15,
    },
    dateArrows: {
        paddingTop: 24,
        paddingLeft: 5,
        paddingRight: 5,
        cursor: "pointer",
        fontWeight: "bold",
    },
    displayFlex: {
        display: "flex",
    },
    reload: {
        display: "inline-block",
        paddingTop: 15,
    },
    graphDiv: {
        borderWidth: "1px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#c3c3c3"
    },
    graphHeading: {
        borderWidth: "0px 0px 1px 0px",
        borderStyle: "solid",
        borderColor: "#c3c3c3",
        paddingBottom: "10px",
        paddingLeft: "15px"
    },
    barchart: {
        width: "90%"
    },
    barchartHeading: {
        fontSize: "small",
        fontWeight: 500,
        marginBottom: "2%"
    },
    screenshotIcons: {
        borderWidth: "1px 0px 0px 0px",
        borderStyle: "solid",
        borderColor: "#c3c3c3",
        marginTop: "5%",
        textAlign: "right"
    },
    tableCell: {
        borderWidth: "1px 1px 1px 1px",
        borderStyle: "solid",
        borderColor: "#c3c3c3",
    },
    heading: {
        backgroundColor: "#1bb555"
    },
    screenShotIcons: {
        height: "20px",
        margin: "5px"
    }
});
class Dashboard extends Component {
    _isMounted = false;
    state = {
        dataa: [],
        open: false,
        employeeScreens: [],
        employeeScreensWithImg: [],
        OrganizationSettings: { Shifts: 0, IncludeLogofToIdle: 0 },
        photoIndex: 0,
        isOpen: false,
        imgToShow: "",
        loading: true,
        arrowRef: null,
        componentLoad: true,
        TimeDiff: 0,
        IdleTime: 0,
        ActualWork: 0,
        logOffScreensCount: 0,
        pageLoaded: false,
        DateForTimeSheet: this.props.match.params.date,
        SelectedEmployeeId: this.props.match.params.id,
        WindowTitle: {},
        totalRecords: 0,
        scrnshots: [],
        isDataLoaded: true,
        showAllData: false,
        isExpanded: false
    };

    handleArrowRef = (node) => {
        this.setState({
            arrowRef: node,
        });
    };
    componentWillMount = () => {
        controller = new AbortController();
        signal = controller.signal;
        console.clear();
        var selectedDate = moment(this.props.match.params.date).format(
            "ddd, DD MMM YYYY"
        );
        this.props.headerTitle(
            this.props.match.params.Name +
            " (" +
            this.props.match.params.id +
            ")" +
            " / " +
            selectedDate,
            3,
            true
        );
        this._isMounted = true;

        var body = {
            OrganizationID: JSON.parse(localStorage.getItem("loggedInUserDetails"))
                .OrganizationID,
        };
        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_ORGANIZATION_SETTINGS, {
            method: "POST",
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.props.loader(false);
                this.setState({
                    OrganizationSettings: responseJson["OrganizationSettings"][0],
                });
                this.getEmployeeScreens(
                    this.props.match.params.id,
                    this.props.match.params.date
                );
            })
            .catch((error) => {
                this.getEmployeeScreens(
                    this.props.match.params.id,
                    this.props.match.params.date
                );
                console.error(error);
            });
    };
    getEmployeeScreens = (empCode, date) => {
        var body = {
            EmpCode: empCode,
            DateForTimeSheet: date + " ",
            OrganizationID: JSON.parse(localStorage.getItem("loggedInUserDetails"))
                .OrganizationID,
        };

        this.setState({
            employeeScreensWithImg: [],
            IdleTime: 0,
            ActualWork: 0,
            TimeDiff: 0,
        });

        this.props.loader(true);
        fetch(Const.API_ROOT + Const.GET_EMPLOYEE_SCREENS, {
            method: "POST",
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.getTimeSheetData(empCode, date);
                if (responseJson.length) {
                    this.setState({
                        employeeScreens: responseJson,
                        totalRecords: responseJson.length,
                    });
                    responseJson.map((data) => {
                        var windowtitle = data.WindowTitles;

                        if (windowtitle !== "" || windowtitle !== undefined) {
                            var splitedarr = windowtitle.split(";");
                            var time = data.ActualUTC;
                            time = new Date(time);
                            time = time.toGMTString().replace('GMT', '');
                            splitedarr.push(time);
                            var arr = splitedarr.filter(
                                (value, index) => splitedarr.indexOf(value) === index
                            );
                            
                            var data = splitedarr[0];
                            var key = "";
                            if (data.indexOf("-") > -1) {
                                var arr = data.split("-");
                                key =
                                    data.indexOf("Excel") > -1 ? arr[0] : arr[arr.length - 1];
                                key = key
                                    .trim()
                                    .split(" ")
                                    .join("_");
                            } else {
                                key = data.replace(" ", "_");
                            }
                            if (key == "") {
                                return;
                            }
                            if (this.state.WindowTitle[key] !== undefined) {
                                var val = this.state.WindowTitle[key];

                                this.state.WindowTitle[key] = val + 1;
                            } else {
                                this.state.WindowTitle[key] = 1;
                            }
                            
                            this.state.scrnshots.push(arr);
                        }
                    });

                    var title = this.state.WindowTitle;
                    this.setState({ WindowTitle: {} });
                    var obj = {}
                    Object.keys(title).map((i, v) => {
                        var val = title[i];
                        var percent = Math.round((val / this.state.totalRecords) * 100);
                        obj[i] = percent;
                    });

                    var keys = Object.keys(obj);
                    keys.sort(function (a, b) { return obj[b] - obj[a] });
                    for (var i = 0; i < keys.length; i++) {
                        this.state.WindowTitle[keys[i]] = obj[keys[i]];
                    }

                    setTimeout(() => {
                        this.setState({ isDataLoaded: true })
                    }, 5000);


                    var expensesByName = d3
                        .nest()
                        .key(function (d) {
                            return d.Hour;
                        })
                        .entries(this.state.employeeScreens);
                    this.setState({
                        employeeScreensWithImg: expensesByName,
                        loading: false,
                    });
                    var LogOffScreens = 0;
                    var startTime =
                        expensesByName.length > 0
                            ? expensesByName[0].values[0].DateOfScreenshot
                            : "";
                    var endTime =
                        expensesByName.length > 0
                            ? expensesByName[expensesByName.length - 1].values[
                                expensesByName[expensesByName.length - 1].values.length - 1
                            ].DateOfScreenshot
                            : "";

                    for (var i = 0; i < this.state.employeeScreensWithImg.length; i++) {
                        var itemLength = this.state.employeeScreensWithImg[i].values.length;
                        var needToADD = 6 - itemLength;
                        var tempValues = [];
                        var blankScreen = { user: 0 };
                        var blankScreens = 0;
                        if (needToADD > 0) {
                            for (var k = 0; k < itemLength; k++) {
                                var time = this.state.employeeScreensWithImg[i].values[k]
                                    .DateOfScreenshot;
                                var n = k + 1;
                                var min = time.split("T")[1].split(":")[1];
                                tempValues.push(this.state.employeeScreensWithImg[i].values[k]);
                                if (this.state.employeeScreensWithImg[i].values[n]) {
                                    var a = moment(
                                        this.state.employeeScreensWithImg[i].values[n]
                                            .DateOfScreenshot
                                    );
                                    var b = moment(
                                        this.state.employeeScreensWithImg[i].values[k]
                                            .DateOfScreenshot
                                    );
                                    var diff = Math.floor(a.diff(b, "seconds") / 60);
                                    blankScreens = Math.floor(diff / 12);
                                    for (var j = 0; j < blankScreens; j++) {
                                        tempValues.push(blankScreen);
                                        if (
                                            this.state.OrganizationSettings.IncludeLogofToIdle &&
                                            a > moment(startTime) &&
                                            a < moment(endTime)
                                        ) {
                                            LogOffScreens++;
                                        }
                                    }
                                } else {
                                    var firstTime = this.state.employeeScreensWithImg[i].values[0]
                                        .DateOfScreenshot;
                                    var firstScreenMin = firstTime.split("T")[1].split(":")[1];
                                    blankScreens = Math.floor(firstScreenMin / 12);
                                    for (j = 0; j < blankScreens; j++) {
                                        tempValues.unshift(blankScreen);
                                        if (
                                            this.state.OrganizationSettings.IncludeLogofToIdle &&
                                            moment(firstTime) > moment(startTime) &&
                                            moment(firstTime) < moment(endTime)
                                        ) {
                                            LogOffScreens++;
                                        }
                                    }
                                    diff = 60 - min;
                                    blankScreens = Math.floor(diff / 12);
                                    for (j = 0; j < blankScreens; j++) {
                                        tempValues.push(blankScreen);
                                        if (
                                            this.state.OrganizationSettings.IncludeLogofToIdle &&
                                            moment(time) > moment(startTime) &&
                                            moment(time) < moment(endTime)
                                        ) {
                                            LogOffScreens++;
                                        }
                                    }
                                }
                            }
                            this.state.employeeScreensWithImg[i].values = tempValues;
                        }
                    }
                    this.setState({
                        logOffScreensCount: LogOffScreens,
                    });
                    this.props.loader(false);
                    this.getBase64Img(0);
                } else {
                    this.props.loader(false);
                    this.setState({
                        loading: false,
                    });
                }
            })
            .catch((error) => {
                this.getTimeSheetData(empCode, date);
                this.props.loader(false);
                this.setState({
                    loading: false,
                });
                console.error(error);
            });
    };
    getTimeSheetData = (empCode, date) => {
        this.setState({
            Employees: [],
        });
        var body = {
            OrganizationID: JSON.parse(localStorage.getItem("loggedInUserDetails"))
                .OrganizationID,
            DateForTimeSheet: date + " ",
            SelectedEmployeeId: empCode,
            IncludeLogofToIdle: this.state.OrganizationSettings.IncludeLogofToIdle,
            active: true,
        };
        fetch(Const.API_ROOT + Const.GET_TIMING_DATA, {
            method: "POST",
            headers: Const.API_HEADER,
            body: JSON.stringify(body),
            signal: signal,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson = responseJson[0];
                this.setState({
                    TimeDiff: this.getHours(responseJson.TimeDiff),
                    IdleTime: this.getHours(responseJson.IdleTime),
                    ActualWork: this.getHours(responseJson.ActualWork),
                    pageLoaded: true,
                });
            })
            .catch((error) => {
                this.setState({
                    pageLoaded: true,
                });
                console.error(error);
            });
    };

    getHours = (minutes) => {
        var hours = Math.floor(minutes / 60);
        var minutes = minutes % 60;
        if (hours < 0) {
            hours = 0;
        }
        if (minutes < 0) {
            minutes = 0;
        }
        return hours + " : " + minutes;
    };
    componentWillUnmount = () => {
        controller.abort();
        this._isMounted = false;
    };
    getParentStatus = () => {
        return this._isMounted;
    };
    getScreenShotDate(date) {
        var date = new Date(date);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        return day.toString() + month.toString() + year.toString();
    }
    async getBase64Img(i) {
        if (this._isMounted) {
            var body = {
                organizationID: JSON.parse(localStorage.getItem("loggedInUserDetails"))
                    .OrganizationID,
                employeeCode: this.state.SelectedEmployeeId,
                date: this.state.employeeScreens[i].ImgFolder,
                imageName: this.state.employeeScreens[i].ImageName,
                token: "$5klpow4",
            };
            var ImageName = this.state.employeeScreens[i].ImageName;
            try {
                const res = await fetch(
                    Const.API_ROOT + Const.GET_EMPLOYEE_BASE64_IMAGE,
                    {
                        method: "POST",
                        headers: Const.API_HEADER,
                        body: JSON.stringify(body),
                        signal: signal,
                    }
                );
                const responseJson = await res.json();

                if (this._isMounted) {
                    if (responseJson.GetEmployeeImageBase64Result) {
                        this.state.employeeScreens[i][
                            "imgString"
                        ] = `data:image/png;base64,${
                            responseJson.GetEmployeeImageBase64Result
                            }`;
                        this.setState({
                            employeeScreens: this.state.employeeScreens,
                        });
                    }
                    this.setState({
                        ["imgloader" + ImageName]: true,
                    });
                    i++;

                    if (i < this.state.employeeScreens.length) {
                        this.getBase64Img(i);
                    }
                }
            } catch (e) {
                i++;
                if (i < this.state.employeeScreens.length) {
                    this.getBase64Img(i);
                }
                this.setState({
                    ["imgloader" + ImageName]: true,
                });
            }
        }
    }
    getIdleStatus(IsIdleTime, KeyStrokes, MouseStrokes) {
        if (IsIdleTime > 0) {
            return 0;
        } else {
            var progress = parseInt(((KeyStrokes + MouseStrokes) * 100) / 600);
            if (progress > 100) {
                progress = 100;
            }
            return progress;
        }
    }
    getActualTime(time) {
        if (time) {
            var actualTime = time.split("T")[1].split(".")[0];
            return this.tConvert(actualTime);
        }
    }
    tConvert(time) {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(""); // return adjusted time or original string
    }
    openImg(url) {
        this.setState({ imgToShow: url, isOpen: true });
    }
    selectEmployee(SelectedEmployeeId, label) {
        this.setState({
            SelectedEmployeeId: SelectedEmployeeId,
            selectedEmployeeName: label,
        });
        this.getEmployeeScreens(SelectedEmployeeId, this.state.DateForTimeSheet);
    }

    handlePopUp = (data, datetime) => {
        datetime = new Date(datetime);
        datetime = datetime.toGMTString().replace('GMT', '');
        this.state.dataa.push(datetime)

        var tarray = data.split(";");
        tarray.forEach((element) => {
            if (element.indexOf("-") > -1) {
                var narray = element.split("-");
                if (element.indexOf("Excel") > -1) {
                    this.state.dataa.push(narray[0]);
                } else {
                    var len = narray.length;
                    this.state.dataa.push(narray[len - 1]);
                }
            }
        });
    };
    handleDateChange = (date) => {
        var date = new Date(date);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var ChangedDate = year + "-" + month + "-" + day;
        this.setState(
            {
                DateForTimeSheet: ChangedDate,
            },
            () => {
                this.getEmployeeScreens(this.state.SelectedEmployeeId, ChangedDate);
            }
        );
    };
    incrementDate = () => {
        var day = this.state.selectedDate;
        var date = new Date(this.state.DateForTimeSheet);
        date.setDate(date.getDate() + 1);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var ChangedDate = year + "-" + month + "-" + day;
        this.setState(
            {
                DateForTimeSheet: ChangedDate,
            },
            () => {
                this.getEmployeeScreens(this.state.SelectedEmployeeId, ChangedDate);
            }
        );
    };
    decrementDate = () => {
        var date = new Date(this.state.DateForTimeSheet);
        date.setDate(date.getDate() - 1);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();
        var ChangedDate = year + "-" + month + "-" + day;
        this.setState(
            {
                DateForTimeSheet: ChangedDate,
            },
            () => {
                this.getEmployeeScreens(this.state.SelectedEmployeeId, ChangedDate);
            }
        );
    };
    reload = () => {
        this.getEmployeeScreens(
            this.state.SelectedEmployeeId,
            this.state.DateForTimeSheet
        );
    };
    render() {
        var { classes } = this.props;
        var { isOpen, isDataLoaded, isExpanded } = this.state;

        return (
            <div>
                <Paper className={classes.paper} style={{ padding: 15 }}>
                    <Grid container spacing={24}>
                        <Grid item xs={2}>
                            {this.state.pageLoaded ? (
                                <EmployeesDropDown
                                    getParentStatus={this.getParentStatus.bind(this)}
                                    selectEmployee={this.selectEmployee.bind(this)}
                                    id={this.state.SelectedEmployeeId}
                                />
                            ) : (
                                    <div className={classes.loadingEmloyeesList}>Loading...</div>
                                )}
                        </Grid>
                        <Grid item xs={3} className={`${classes.displayFlex}`}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <i
                                    className={`material-icons ${classes.dateArrows}`}
                                    onClick={this.decrementDate}
                                >
                                    chevron_left
                </i>
                                <DatePicker
                                    keyboard
                                    label="Date"
                                    value={this.state.DateForTimeSheet}
                                    onChange={this.handleDateChange}
                                    format={"DD/MM/YYYY"}
                                    className={classes.DatePicker}
                                    disableOpenOnEnter
                                />
                                <i
                                    className={`material-icons ${classes.dateArrows}`}
                                    onClick={this.incrementDate}
                                >
                                    chevron_right
                </i>
                            </MuiPickersUtilsProvider>
                        </Grid>

                        <Grid item xs={2}>
                            <Typography component="p">Hours Worked</Typography>
                            <Typography variant="h5" component="h3">
                                {this.state.TimeDiff}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography component="p">Idle Time</Typography>
                            <Typography variant="h5" component="h3">
                                {this.state.IdleTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography component="p">Actual Work</Typography>
                            <Typography variant="h5" component="h3">
                                {this.state.ActualWork}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <div onClick={this.reload} className={classes.reload}>
                                <i className="material-icons">refresh</i>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>


                <div className={classes.graphDiv}>
                    <p className={classes.graphHeading}>Active Windows and Software Used Logs
                    {isExpanded && <ExpandLessIcon style={{ color: "#1bb555", fontSize: 30, float: "right", paddingRight: "10px" }} onClick={() => this.setState({ isExpanded: false })}></ExpandLessIcon>}
                        {!isExpanded &&
                            <ExpandMoreIcon style={{ color: "#1bb555", fontSize: 30, float: "right", paddingRight: "10px" }} onClick={() => this.setState({ isExpanded: true })}></ExpandMoreIcon>}
                    </p>
                    {isExpanded && <div>
                        {isDataLoaded && <div>
                            {this.state.WindowTitle && <p style={{ fontSize: "smaller", textAlign: "right", paddingRight: 10, cursor: "pointer" }} onClick={() => this.setState({ showAllData: true, open: true })}>View All Application Titles </p>}
                            <div style={{ padding: "10px", width: "90%" }}>
                                {Object.keys(this.state.WindowTitle).map((index, value) => {
                                    const val = this.state.WindowTitle[index];
                                    return (
                                        <div className={classes.barchartHeading}>
                                            {index.includes(":") ? "" : index.split("_").join(" ")}
                                            <div />
                                            <LinearProgress
                                                className={[classes.margin, classes.barchart]}
                                                variant="determinate"
                                                color="primary"
                                                value={this.state.WindowTitle[index]}
                                            />
                                            <p style={{ float: "right", width: "10%", marginTop: "-12px", paddingLeft: "10px" }}>{val + "%"}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        }
                    </div>
                    } </div>
                {this.state.loading ? (
                    ""
                ) : (
                        <div className={classes.graphDiv} style={{ marginTop: "3%" }}>
                            <p className={classes.graphHeading}>Screenshots</p>
                            {" "}
                            {this.state.employeeScreensWithImg.length ? (
                                this.state.employeeScreensWithImg.map((data, i) =>
                                    (
                                        <div key={i} className={classes.root} style={{ padding: 15 }}>
                                            <Grid item xs={12}>
                                                <Typography component="h1" variant="h5" align="left">
                                                    {this.tConvert(
                                                        data.key.length < 2
                                                            ? "0" + data.key + ":00:00"
                                                            : data.key + ":00:00"
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid container className={classes.gridList} spacing={16}>
                                                {data.values.map((tile, j) => (
                                                    <>
                                                        <Grid key={j} item xs={12} sm={2}>
                                                            {tile.user != 0 ? (
                                                                <div>
                                                                    <Paper className={classes.paper}>
                                                                        {this.state["imgloader" + tile.ImageName] ? (
                                                                            <img
                                                                                src={
                                                                                    tile.imgString
                                                                                        ? tile.imgString
                                                                                        : ReplacementImage
                                                                                }
                                                                                className={classes.image}
                                                                                alt={i}
                                                                            />
                                                                        ) : (
                                                                                <div className={classes.loaderDiv}>
                                                                                    <CircularProgress
                                                                                        className={classes.image}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        <Tooltip
                                                                            title={
                                                                                <React.Fragment>
                                                                                    Mouse Strokes : {tile.MouseStrokes}
                                                                                    <br />
                                                                                    Key Strokes : {tile.KeyStrokes}
                                                                                    <br />
                                                                                    Percentage :{" "}
                                                                                    {this.getIdleStatus(
                                                                                        tile.IsIdleTime,
                                                                                        tile.KeyStrokes,
                                                                                        tile.MouseStrokes
                                                                                    )}
                                                                                    <span
                                                                                        className={classes.arrow}
                                                                                        ref={this.handleArrowRef}
                                                                                    />
                                                                                </React.Fragment>
                                                                            }
                                                                            placement="top"
                                                                            classes={{
                                                                                tooltip: classes.bootstrapTooltip,
                                                                                popper: classes.bootstrapPopper,
                                                                                tooltipPlacementLeft:
                                                                                    classes.bootstrapPlacementLeft,
                                                                                tooltipPlacementRight:
                                                                                    classes.bootstrapPlacementRight,
                                                                                tooltipPlacementTop:
                                                                                    classes.bootstrapPlacementTop,
                                                                                tooltipPlacementBottom:
                                                                                    classes.bootstrapPlacementBottom,
                                                                            }}
                                                                            PopperProps={{
                                                                                popperOptions: {
                                                                                    modifiers: {
                                                                                        arrow: {
                                                                                            enabled: Boolean(this.state.arrowRef),
                                                                                            element: this.state.arrowRef,
                                                                                        },
                                                                                    },
                                                                                },
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={
                                                                                    parseInt(
                                                                                        tile.KeyStrokes + tile.MouseStrokes
                                                                                    ) === 0
                                                                                        ? classes.backgroundRed
                                                                                        : this.getIdleStatus(
                                                                                            tile.IsIdleTime,
                                                                                            tile.KeyStrokes,
                                                                                            tile.MouseStrokes
                                                                                        ) < 5
                                                                                            ? classes.backgroundYellow
                                                                                            : classes.titleDiv
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    variant="subtitle2"
                                                                                    align="left"
                                                                                >
                                                                                    {this.getActualTime(
                                                                                        tile.DateOfScreenshot
                                                                                    )}
                                                                                </Typography>
                                                                                <LinearProgress
                                                                                    variant="determinate"
                                                                                    value={this.getIdleStatus(
                                                                                        tile.IsIdleTime,
                                                                                        tile.KeyStrokes,
                                                                                        tile.MouseStrokes
                                                                                    )}
                                                                                    classes={{
                                                                                        barColorPrimary:
                                                                                            classes.linearBarColorPrimary,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </Tooltip>
                                                                        <div className={classes.screenshotIcons}>
                                                                            <img src={require('../images/eye-icon.png')} onClick={() => this.openImg(tile.imgString)} className={classes.screenShotIcons} />
                                                                            <img src={require('../images/activity-log.png')} onClick={() => {
                                                                                this.handlePopUp(tile.WindowTitles, tile.DateOfScreenshot);
                                                                                this.setState({ ...this.state, open: true, showAllData: false });
                                                                            }}
                                                                                className={classes.screenShotIcons} />
                                                                        </div>
                                                                    </Paper>

                                                                    {this.state.open ? (
                                                                        <SimpleDialog open={this.state.open}>
                                                                            <DialogContent backgroundColor="transparent">
                                                                                {!this.state.showAllData
                                                                                    && this.state.dataa.length > 0 && this.state.dataa.map((data, index) => {
                                                                                        return (
                                                                                            index == 0 ?
                                                                                                <TableRow>
                                                                                                    <TableCell className={[classes.tableCell, classes.heading]}>{data}</TableCell>
                                                                                                </TableRow> :
                                                                                                <TableRow>
                                                                                                    <TableCell className={classes.tableCell}>{data}</TableCell>
                                                                                                </TableRow>
                                                                                        );
                                                                                    })
                                                                                }
                                                                                {this.state.showAllData && this.state.scrnshots.length > 0
                                                                                    && this.state.scrnshots.map(
                                                                                        (data, index) => {
                                                                                            const reversedArr = data.reverse();
                                                                                            return reversedArr.map((value, i) => {
                                                                                                return i == 0 ? (
                                                                                                    <TableRow>
                                                                                                        <TableCell className={[classes.tableCell, classes.heading]}>{value}</TableCell>
                                                                                                    </TableRow>
                                                                                                ) :
                                                                                                    <TableRow>
                                                                                                        <TableCell className={classes.tableCell}>{value}</TableCell>
                                                                                                    </TableRow>

                                                                                            });
                                                                                        }
                                                                                    )
                                                                                }
                                                                            </DialogContent>
                                                                            <DialogActions>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        this.setState({
                                                                                            ...this.state,
                                                                                            open: false,
                                                                                        });
                                                                                    }}
                                                                                    color="primary"
                                                                                >
                                                                                    close
                                                                                </button>
                                                                            </DialogActions>
                                                                        </SimpleDialog>
                                                                    ) : null}
                                                                </div>
                                                            ) : (
                                                                    <Paper
                                                                        style={{
                                                                            padding: 5,
                                                                            paddingTop: 40,
                                                                            backgroundColor: "#fb2323ad",
                                                                            height: 145,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="subtitle2"
                                                                            style={{ color: "#fff" }}
                                                                            align="center"
                                                                        >
                                                                            No time log for this time. Either user is not
                                                                            logged in or tracker is stopped
                                                                        </Typography>
                                                                    </Paper>
                                                                )}
                                                        </Grid>
                                                    </>
                                                ))}
                                            </Grid>
                                        </div>
                                    )
                                )
                            ) : (
                                    <Grid item xs={12}>
                                        <Typography
                                            component="h1"
                                            style={{ marginTop: 200 }}
                                            variant="h5"
                                            align="center"
                                        >
                                            No screenshot found!
                                        </Typography>
                                    </Grid>
                                )}
                        </div>
                    )}
                {isOpen && (
                    <>
                        <Lightbox
                            mainSrc={this.state.imgToShow}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    </>
                )}
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(Dashboard);
