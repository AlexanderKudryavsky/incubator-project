import React, {useEffect, useState} from 'react'
import {makeStyles} from "@material-ui/core/styles";

import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'
import {Drawer, List, ListItem, ListItemIcon,} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import HomeIcon from '@material-ui/icons/Home';
import ListItemText from "@material-ui/core/ListItemText";


const useStyles = makeStyles((theme) => ({
    drawerPaper: {width: 'inherit'},
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    hide: {display: 'none'},

}))

export function AddPlacemarkForm(props) {
    const classes = useStyles();
    let panelOpen = props.panelOpen;

    const[country, setCountry] = useState('');
    const[city, setCity] = useState('');
    const[title, setTitle] = useState('');
    const[workTime, setWorkTime] = useState('');

    let coordinates = props.newPlacemarkCoordinates;

    const onChangeCity = (e) => {
        let value = e.target.value;
        setCity(value);
    }

    const onChangeCountry = (e) => {
        let value = e.target.value;
        setCountry(value);
    }

    const onChangeTitle = (e) => {
        let value = e.target.value;
        setTitle(value);
    }

    const onChangeWorkTime = (e) => {
        let value = e.target.value;
        setWorkTime(value);
    }

    const onChangeLatitude = (e) => {
        props.setNewPlacemarkCoordinates([e.target.value,coordinates[1]])
    }

    const onChangeLongitude = (e) => {
        props.setNewPlacemarkCoordinates([coordinates[0],e.target.value])
    }



    const handleDrawerOpen = () => {

        props.addPlacemark(props.newPlacemarkCoordinates, country, city, title, workTime)
        props.openPanelControl(!panelOpen);
        setCity('');
        setCountry('');
        setTitle('');
        setWorkTime('');
    };


    return (
        <BrowserRouter>
            <div style={{display: 'flex'}}>
                <Drawer
                    style={{width: '250px'}}
                    className={`${(!panelOpen && classes.hide)}`}
                    variant={'permanent'}
                    anchor={'right'}
                    open={panelOpen}
                    classes={{paper: classes.drawerPaper}}

                >

                    <List>
                        <ListItem>
                            <TextField
                                label="Number"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                value = {coordinates[0] ? +coordinates[0]: 0}
                                onChange = {onChangeLatitude}
                            />
                            <TextField
                                label="Number"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                value = {coordinates[1] ? +coordinates[1]: 0}
                                onChange = {onChangeLongitude}
                            />
                            {/*<TextField value = {props.newPlacemarkCoordinates} onChange = {onChangeCountry}  id="outlined-basic" label="Coordinates" variant="outlined"/>*/}
                        </ListItem>
                        <ListItem>
                            <TextField value = {country} onChange = {onChangeCountry}  id="outlined-basic" label="Country" variant="outlined"/>
                        </ListItem>
                        <ListItem>
                            <TextField value = {city} onChange = {onChangeCity}  id="outlined-basic" label="City" variant="outlined"/>
                        </ListItem>
                        <ListItem>
                            <TextField value = {title} onChange = {onChangeTitle}  id="outlined-basic" label="Title" variant="outlined"/>
                        </ListItem>
                        <ListItem>
                            <TextField value = {workTime} onChange = {onChangeWorkTime}  id="outlined-basic" label="Work-time" variant="outlined"/>
                        </ListItem>
                        <ListItem>
                            <TextareaAutosize
                                style = {{width: '210px', margin: '0 auto'}}
                                rowsMin={4}
                                rowsMax={15}
                                aria-label="maximum height"
                                placeholder="Description"
                                defaultValue="hhh"
                            />
                        </ListItem>
                        <Link to={'/'} className = {classes.link}>
                            <ListItem button onClick={handleDrawerOpen}>
                                <ListItemIcon>
                                    <HomeIcon fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText>Ok</ListItemText>
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
            </div>
        </BrowserRouter>

    )
}


