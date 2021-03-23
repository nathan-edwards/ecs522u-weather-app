import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Geocode from "react-geocode"

const useStyles = makeStyles((theme) => ({
  modal: {
    alignItems: "top",
    justifyContent: "center",
    paddingTop: "40px",
    margin: '0 auto',
    width: '350px'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function GoogleSearchModal() {
  Geocode.setApiKey("AIzaSyCyMDZZnpCXXOQ1CX7f6pxFx4snZlxPjQA");
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log(location)
    if (location === null || typeof location === 'undefined') {
      setLocation('London')
    }
    localStorage.setItem('location', location.value.structured_formatting.main_text);
    localStorage.setItem('address', location.label)
    Geocode.fromAddress(location.label).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        localStorage.setItem('lat', lat)
        localStorage.setItem('lng', lng)
      },
      (error) => {
        console.error(error);
      }
    );
    setOpen(false);
    window.location.reload(false)
  };

  return (
    <div>
      <IconButton aria-label="delete" disableRipple={true} onClick={handleOpen}>
        {localStorage.getItem('location')} <ExpandMoreIcon />
      </IconButton>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <GooglePlacesAutocomplete
              apiKey="AIzaSyCyMDZZnpCXXOQ1CX7f6pxFx4snZlxPjQA"
              selectProps={{
                location,
                onChange: setLocation,
              }}
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
