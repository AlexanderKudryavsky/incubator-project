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
}))

export function AddPlacemarkForm(props) {
    let panelOpen = props.panelOpen

    const classes = useStyles()
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [title, setTitle] = useState('')
    const [workTime, setWorkTime] = useState('')
    const [description, setDescription] = useState('')


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
        const {value} = e.target
        setTitle(value)
    }

    const onChangeWorkTime = (e) => {
        const {value} = e.target
        setWorkTime(value)
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
        props.addPlacemark({coordinates, country, city, title, description, workTime})
        props.openPanelControl(!panelOpen)
        setCity('')
        setCountry('')
        setTitle('')
        setWorkTime('')
        setDescription('')
    }

    const closePanel = () => {
        props.openPanelControl(!panelOpen)
        setCity('')
        setCountry('')
        setTitle('')
        setWorkTime('')
        setDescription('')
    }


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
                            label="Number"
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
                            label="Number"
                            type="number"
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                            value={coordinates[1] ? +coordinates[1] : 0}
                            onChange={onChangeLongitude}/>
                    </ListItem>
                    <ListItem>
                        <TextField value={country} onChange={onChangeCountry} id="outlined-basic" label="Country"
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem>
                        <TextField value={city} onChange={onChangeCity} id="outlined-basic" label="City"
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem>
                        <TextField value={title} onChange={onChangeTitle} id="outlined-basic" label="Title"
                                   variant="outlined"/>
                    </ListItem>
                    <ListItem>
                    </ListItem>
                    <ListItem>
                        <TextField value={workTime} onChange={onChangeWorkTime} id="outlined-basic"
                                   label="Work-time" variant="outlined"/>
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


