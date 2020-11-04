import React, {useState} from 'react'
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

export function AddPlacemarkForm() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(!open);
    };


    return (
        <BrowserRouter>
            <div style={{display: 'flex'}}>
                <Drawer
                    style={{width: '250px'}}
                    className={`${(open && classes.hide)}`}
                    variant={'permanent'}
                    anchor={'right'}
                    open={open}
                    classes={{paper: classes.drawerPaper}}

                >

                    <List>
                        <ListItem>
                            {/*<ListItemIcon>*/}
                            {/*    <HomeIcon fontSize="small"/>*/}
                            {/*</ListItemIcon>*/}
                            <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                        </ListItem>
                        <ListItem>
                            <TextareaAutosize
                                style = {{width: '210px', margin: '0 auto'}}
                                rowsMin={4}
                                rowsMax={15}
                                aria-label="maximum height"
                                placeholder="Description"
                                defaultValue=""
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


