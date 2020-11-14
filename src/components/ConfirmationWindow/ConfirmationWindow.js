import React from 'react'
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";


export function ConfirmationWindow(props) {
    const useStyles = makeStyles({
        root: {
            textAlign: 'center',
            maxWidth: 345,
            position: "absolute",
            zIndex: 3010,

        },
        button: {
            margin: '0 auto',
        },
        media: {
            height: 140,

        },
    });
    const classes = useStyles();

    const openControlPanelHandler = () => {
        props.setPositionConfWindow(false);
        props.openPanelControl();

    }


    return (
        <Card className={classes.root}
              style={{top: props.positionConfWindow[1] - 180, left: props.positionConfWindow[0]}}>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Внимание
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Вы действительно хотите добавить новую школу на карту?
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button className={classes.button} size="small" color="primary" onClick={openControlPanelHandler}>
                    Ok
                </Button>
                <Button className={classes.button} size="small" color="primary">
                    Cancel
                </Button>
            </CardActions>
        </Card>
    );
}


