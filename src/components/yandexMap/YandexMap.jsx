import React, {useRef, useState} from 'react'
import {
    Clusterer,
    GeolocationControl,
    Map,
    Placemark, RouteButton,
    RoutePanel,
    SearchControl,
    YMaps,
    ZoomControl
} from 'react-yandex-maps'
import {AddPlacemarkForm} from '../addPlacemarkForm/AddPlacemarkForm'
import style from './yandexMap.module.css'
import {LeftCards} from '../leftCards/LeftCards'
import {ConfirmationWindow} from '../confirmationWindow/ConfirmationWindow'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import Button from '@material-ui/core/Button'
import {restoreState, saveState} from "../common/localStorage";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export const YandexMap = () => {

    const {transcript, resetTranscript} = useSpeechRecognition()

    useEffect(() => {
        const input = document.querySelector('.ymaps-2-1-77-searchbox-input__input')
        if (input) {
            input.value = transcript
        }
    }, [transcript])

    const coordinates = [
        {
            coordinate: [53.917501, 27.604851],
            country: 'Belarus',
            city: 'Minsk',
            logo: null,
            title: 'IT-KAMASUTRA',
            description: 'Some info about school...',
            workTime: '09:00 - 21:00',
            rating: {
                star: 5
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        },
        {
            coordinate: [53.905044, 27.540433],
            country: 'Belarus',
            city: 'Minsk',
            logo: null,
            title: 'IT-ACADEMY',
            description: 'Some info about school...',
            workTime: '09:00 - 21:00',
            rating: {
                star: 1 // фуфуфу...))
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        }
    ]

    const map = useRef()
    const ymaps = useRef(null)
    const modules = ['layout.ImageWithContent', 'GeoObjectCollection', 'Placemark']
    const [panelOpen, setPanelOpen] = useState(false)
    const [placemarkObjects, setPlacemarkObjects] = useState(!!localStorage.getItem('placeMark') && restoreState('placeMark', coordinates))
    const [newPlacemarkCoordinates, setNewPlacemarkCoordinates] = useState([])
    const [startStateMapZoom, setStartStateMapZoom] = useState({center: [42.50, -27.74], zoom: 3}) // Minsk
    const [positionConfWindow, setPositionConfWindow] = useState([])
    const [positionConfWindowOpen, setPositionConfWindowOpen] = useState(false)
    const [routeMode, setRouteMode] = useState(false)
    const [myPos, setMyPos] = useState();
    const [darkMode, setDarkMode] = useState(!!localStorage.getItem('DarkMode') && restoreState('DarkMode', false))

    const getMyPosition = () => {
        let geolocationControlEl = map.current.controls.get(2)
        geolocationControlEl.events.add('locationchange', function (event) {
            setMyPos(event.get('position'))
        })

    }

    const getDirections = (coordinates) => {

            let pannel = map.current.controls.get(1).routePanel;
            pannel.options.set('adjustMapMargin', true);
            pannel.state.set({
                fromEnabled: true,
                from: myPos ,
                to: coordinates,
                type: "auto"
            });

    }



    const addPlacemark = ({coordinates, country, city, title, description, workTime}) => {
        let newPlacemark = {
            coordinate: coordinates,
            country: country,
            city: city,
            logo: null,
            title: title,
            description: description,
            workTime: workTime,

            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        }
        let newArray = [...placemarkObjects, newPlacemark]
        saveState('placeMark', newArray)
        setPlacemarkObjects(newArray)
    }

    const onClickLeftCards = (coordinates) => {
        map.current.panTo(coordinates, {flying: 1})
        getDirections(coordinates)

    }

    const changeMode = (value) => {
        setDarkMode(value.target.checked)
        saveState('DarkMode', value.target.checked)
    }

    const openConfirmationWindow = (e) => {
        if (panelOpen) {
            return
        }
        const position = e.get('coords')
        const windowPosition = e.get('clientPixels')
        setPositionConfWindow(windowPosition)
        setNewPlacemarkCoordinates(position)
        setPositionConfWindowOpen(!positionConfWindowOpen)
    }

    const openPanelControl = () => !panelOpen && setPanelOpen(!panelOpen)

    // code for search input
    const dataConvert = (coordinates) => {
        let features = []
        coordinates && coordinates.map((c) => {
            const lat = c.coordinate[0]
            const lon = c.coordinate[1]
            let tmpObj = {
                type: 'Feature',
                id: c.title,
                route: c,
                geometry: {
                    type: 'Point',
                    coordinates: [lat, lon]
                }
            }
            return features.push(tmpObj)
        })
        return features
    }

    class CustomSearchProvider {
        constructor(points) {
            this.points = points
        }

        geocode(request, options) {

            let deferred = ymaps.current && ymaps.current.vow.defer()
            let geoObjects = ymaps.current && new ymaps.current.GeoObjectCollection()

            let offset = options.skip || 0
            let limit = options.results || 20

            let points = []
            for (let i = 0, l = this.points.length; i < l; i++) {
                let point = this.points[i]
                debugger
                if (point.title.toLowerCase().indexOf(request.toLowerCase()) !== -1) {
                    points.push(point)
                }
            }

            // При формировании ответа можно учитывать offset и limit.
            points = points.splice(offset, limit)

            // Добавляем точки в результирующую коллекцию.
            for (let i = 0, l = points.length; i < l; i++) {
                let point = points[i],
                    coordinates = point.coordinate,
                    title = point.title

                geoObjects.add(
                    new ymaps.current.Placemark(coordinates, {
                        name: title,
                        description: `${point.country}, ${point.city}`,
                        balloonContentBody: `<p>${title}</p>`,
                        boundedBy: [coordinates, coordinates]
                    })
                )
            }

            deferred.resolve({
                // Геообъекты поисковой выдачи.
                geoObjects,
                // Метаинформация ответа.
                metaData: {
                    geocoder: {
                        // Строка обработанного запроса.
                        request,
                        // Количество найденных результатов.
                        found: geoObjects.getLength(),
                        // Количество возвращенных результатов.
                        results: limit,
                        // Количество пропущенных результатов.
                        skip: offset
                    }
                }
            })
            // Возвращаем объект-обещание.
            return deferred.promise()
        }
    }

    return (
        <YMaps enterprise
               query={{
                   apikey: '1c7f4567-d722-4829-8b8c-6dae4d41a40c\n'
               }}>
            <Map state={startStateMapZoom}
                 className={ darkMode ? style.containerBlack : style.containerWhite}
                 modules={modules}
                 onLoad={(api) => ymaps.current = api}
                 features={dataConvert(coordinates)}
                 instanceRef={map}
                 onContextMenu={openConfirmationWindow}>
                <SearchControl options={{
                    float: 'left',
                    maxWidth: 190,
                    noPlacemark: true,
                    provider: new CustomSearchProvider(placemarkObjects),
                    resultsPerPage: 5
                }}/>
                <ZoomControl options={{float: 'right'}}/>
                {positionConfWindowOpen && <ConfirmationWindow openPanelControl={openPanelControl}
                                                               setPositionConfWindow={setPositionConfWindowOpen}
                                                               positionConfWindow={positionConfWindow}
                />}
                <AddPlacemarkForm
                    panelOpen={panelOpen}
                    openPanelControl={setPanelOpen}
                    addPlacemark={addPlacemark}
                    newPlacemarkCoordinates={newPlacemarkCoordinates}
                    setNewPlacemarkCoordinates={setNewPlacemarkCoordinates}/>
                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}>
                    {placemarkObjects.map((point, index) => {
                        const schoolBalloon =
                            `<div id="menu">\
                                            <h3 class="titleInfo">${point.title}</h3>\
                                        <div>Address: ${point.city}, ${point.country}</div>
                                        <div>Mode: ${point.workTime}</div>
                                        <div>${point.description}</div>
                                    </div>`
                        return <Placemark key={index}
                                          properties={{
                                              balloonContent: [`${schoolBalloon}`]
                                          }}
                                          modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                                          geometry={point.coordinate}/>
                    })}
                </Clusterer>
                <GeolocationControl onClick={getMyPosition}/>

                <button style={{
                    width: 90, height: 28, position: 'absolute',
                    top: 11, left: 380, zIndex: 50,
                    borderRadius: 2,
                    backgroundColor: '#ffdb4d',
                    border: 'none',
                    outline: 'none'
                }}
                        onClick={SpeechRecognition.startListening}>
                    Microphone
                </button>

                {/*    <button onClick={SpeechRecognition.stopListening}>Stop</button>*/}

                <LeftCards state={placemarkObjects} onClickLeftCards={onClickLeftCards}/>
                <RoutePanel options={{float: 'right', autofocus: false}}/>
                <GeolocationControl onClick={getMyPosition}/>
                    <FormGroup className={style.switcher}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={changeMode}
                                    color="primary"
                                />
                            }
                            label="Dark mode"
                        />
                    </FormGroup>
                <LeftCards state={placemarkObjects} onClickLeftCards={onClickLeftCards} darkMode={darkMode}/>
                <RoutePanel options={{float: 'right', autofocus: false}}/>
            </Map>
        </YMaps>
    )
}