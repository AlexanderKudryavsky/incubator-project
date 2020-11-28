import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Drawer, List, ListItem} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(({palette}) => ({
    drawerPaper: {width: 'inherit'},
    link: {
        textDecoration: 'none',
        color: palette.text.primary
    },
    hide: {display: 'none'},
    buttonContainer: {
        display: 'flex',
        justifyContent: "space-evenly",
    },
    error: {
        border: '4px solid red',
        color: 'red',
        fontWeight: 'bold',
        borderRadius: '10px'

    },
    textField: {
        fontWeight: 'bold',
        margin: '0 auto',
    }
}))

export function AddPlacemarkForm(props) {
    let panelOpen = props.panelOpen
    const classes = useStyles()
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedDateFrom, setSelectedDateFrom] = useState('07:30');
    const [selectedDateTo, setSelectedDateTo] = useState('07:30');
    const [error, setError] = useState(false)
    let coordinates = props.newPlacemarkCoordinates

    const onChangeCity = (e) => {
        const {value} = e.target
        setCity(value)
    }

    const onChangeCountry = (e) => {
        const {value} = e.target
        setCountry(value)
    }

    const onChangeTitle = (e) => {
        if(title){
            setError(false);
        }
        const {value} = e.target
        setTitle(value)
    }

    const onChangeLatitude = (e) => {
        props.setNewPlacemarkCoordinates([e.target.value, coordinates[1]])
    }

    const onChangeLongitude = (e) => {
        props.setNewPlacemarkCoordinates([coordinates[0], e.target.value])
    }

    const onChangeDescription = (e) => {
        const {value} = e.target
        setDescription(value)
    }

    const handleDrawerOpen = () => {
        if( !title) {
            setError(true)
            return
        }
        let workTime = selectedDateFrom + ' - '+ selectedDateTo
        props.addPlacemark({coordinates, country, city, title, description, workTime})
        props.openPanelControl(!panelOpen)
        setCity('')
        setCountry('')
        setTitle('')
        setSelectedDateFrom('07:30')
        setSelectedDateTo('07:30')
        setDescription('')
    }

    const closePanel = () => {
        props.openPanelControl(!panelOpen)
        setCity('')
        setCountry('')
        setTitle('')
        setSelectedDateFrom('07:30')
        setSelectedDateTo('07:30')
        setDescription('')
        setError(false)
    }

    const handleDateChangeFrom = (e) => {
        setSelectedDateFrom(e.currentTarget.value);
    };
    const handleDateChangeTo = (e) => {
        setSelectedDateTo(e.currentTarget.value);
    };

    return (
        <div style={{display: 'flex'}}>
            <Drawer
                style={{width: '250px'}}
                className={`${(!panelOpen && classes.hide)}`}
                variant={'permanent'}
                anchor={'right'}
                open={panelOpen}
                classes={{paper: classes.drawerPaper}}>
                <List>
                    <ListItem>
                        <TextField
                            label="Latitude"
                            type="number"
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                            value={coordinates[0] ? +coordinates[0] : 0}
                            onChange={onChangeLatitude}/>
                    </ListItem>
                    <ListItem>
                        <TextField
                            label="Longitude"
                            type="number"
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                            value={coordinates[1] ? +coordinates[1] : 0}
                            onChange={onChangeLongitude}/>
                    </ListItem>
                    <ListItem>
                        <TextField className={error && classes.error} value={country} onChange={onChangeCountry} id="outlined-basic" label={error ? "Enter Country" : "Country"}
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem>
                        <TextField className={error && classes.error} value={city} onChange={onChangeCity} id="outlined-basic" label={error ? "Enter City" : "City"}
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem>
                        <TextField className={error && classes.error} value={title} onChange={onChangeTitle} id="outlined-basic" label={error ? "Enter Title" : "Title"}
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem >
                        <div className={classes.textField}>Working hours</div>

                    </ListItem>
                    <ListItem className={classes.buttonContainer}>
                        <TextField
                            id="time"
                            label="From"
                            type="time"
                            defaultValue="07:30"
                            className={classes.textField}
                            value={selectedDateFrom}
                            onChange={handleDateChangeFrom}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                        <TextField
                            id="time"
                            label="To"
                            type="time"
                            defaultValue="20:00"
                            className={classes.textField}
                            value={selectedDateTo}
                            onChange={handleDateChangeTo}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </ListItem>

                    <ListItem>
                        <TextareaAutosize
                            style={{width: '210px', margin: '0 auto'}}
                            rowsMin={4}
                            rowsMax={15}
                            aria-label="maximum height"
                            placeholder="Description"
                            onChange={onChangeDescription}
                            value={description}
                        />
                    </ListItem>
                    <ListItem className={classes.buttonContainer}>
                        <Button onClick={handleDrawerOpen}>Ok</Button>
                        <Button onClick={closePanel}>Cancel</Button>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    )
}



