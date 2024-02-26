import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import './timeconverter.css';
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { Typography, Container, Grid, TextField, MenuItem, Card, CardContent, AppBar, Toolbar, IconButton, Box, makeStyles } from "@material-ui/core";
import { Menu as MenuIcon, AccessTime as AccessTimeIcon } from "@material-ui/icons";
import Navbar from "../components/navbar/Navbar"; // Make sure you have this component or replace it with a Material-UI AppBar

// Styles for Material-UI components
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  card: {
    minWidth: 275,
    margin: theme.spacing(2),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
}));

const TimeConverter = () => {
  const classes = useStyles();
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata"); // Default time zone
  const [currentTime, setCurrentTime] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const timeZones = ["Asia/Kolkata", "America/New_York", "America/Los_Angeles", "America/Toronto", "America/Vancouver", "Europe/Warsaw"];
      const currentTime = timeZones.reduce((acc, zone) => {
        acc[zone] = moment().tz(zone).format("YYYY-MM-DD HH:mm:ss");
        return acc;
      }, {});
      setCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleTimeZoneChange = (e) => {
    setSelectedTimeZone(e.target.value);
  };

  const convertTime = (fromTimeZone, toTimeZone) => {
    const convertedTime = moment(selectedTime).tz(fromTimeZone).tz(toTimeZone);
    return convertedTime.format("YYYY-MM-DD HH:mm:ss");
  };
  const calendarUrl = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&bgcolor=%23ffffff&title=Google%20Calender&src=cHJhdml0cGJoYXRpYUBnbWFpbC5jb20&color=%23F4511E";

  // Google Calendar event creation URL
  const createEventUrl = "https://calendar.google.com/calendar/ical/pravitpbhatia%40gmail.com/private-0868a0340f5736c99a4e5d0db23dcc23/basic.ics";
  // List of time zones for dropdown
  const timeZones = [
    { label: "IST (India)", value: "Asia/Kolkata" },
    { label: "US Eastern Time", value: "America/New_York" },
    { label: "US Pacific Time", value: "America/Los_Angeles" },
    { label: "Canada Eastern Time", value: "America/Toronto" },
    { label: "Canada Pacific Time", value: "America/Vancouver" },
    { label: "Poland", value: "Europe/Warsaw" },
    // Add more time zones as needed
  ];

  return (
    <div className="time_converter">
      <Navbar />
    <Container className="timeconverter">
      <AppBar position="static">
        <Toolbar>
          
          <Typography variant="h6" className={classes.title}>
            Time Zone Converter & World Clock
          </Typography>
          <AccessTimeIcon />
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Time Zone Converter
              </Typography>
              <Box mt={3}>
                <TextField
                  id="datetime-local"
                  label="Select Time"
                  type="datetime-local"
                  defaultValue={moment(selectedTime).format("YYYY-MM-DDTHH:mm")}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => handleTimeChange(moment(e.target.value).toDate())}
                />
              </Box>
              <Box mt={3}>
                <TextField
                  select
                  label="Select Time Zone"
                  value={selectedTimeZone}
                  onChange={handleTimeZoneChange}
                  helperText="Please select your time zone"
                >
                  {timeZones.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box mt={3}>
                <Typography variant="body2" component="p">
                  Converted Time:
                </Typography>
                <Typography variant="body2" component="p">
                  IST Time: {convertTime("Asia/Kolkata", "Asia/Kolkata")}
                </Typography>
                <Typography variant="body2" component="p">
                  {timeZones.find((zone) => zone.value === selectedTimeZone).label} Time: {convertTime("Asia/Kolkata", selectedTimeZone)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                World Clock
              </Typography>
              {Object.keys(currentTime).map((zone) => (
                <Typography key={zone} variant="body2" component="p">
                  {zone.replace('_', ' ')}: {currentTime[zone]}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12}>
          <Typography variant="h5" component="h2" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            
          </Typography>
          <div className="gcal-iframe">
            <iframe src={calendarUrl} frameBorder="0" scrolling="no"></iframe>
          </div>
          
        </Grid>
    </Container>
    </div>
  );
};

export default TimeConverter;
