import React, {useState} from 'react'
import style from './yandexMap.module.css'
import {LeftCards} from "../LeftCards/LeftCards";
import {Clusterer, GeolocationControl, Map, Placemark, SearchControl, YMaps, ZoomControl} from 'react-yandex-maps'
import {AddPlacemarkForm} from "../AddPlacemarkForm/AddPlacemarkForm";

export const YandexMap = () => {

    let [startStateMapZoom, setStartStateMapZoom] = useState({center: [42.50, -27.74], zoom: 3}) // Minsk

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

    const clickPlacemark = () => {
        console.log('Clicked')
    }

    const [placemarkObjects, setPlacemarkObjects] = useState(coordinates);
    const [map, setMap] = useState({});
    const [panelOpen, setPanelOpen] = useState(false);
    const [newPlacemarkCoordinates, setNewPlacemarkCoordinates] = useState([]);


    const openPanelControl = () => !panelOpen && setPanelOpen(!panelOpen);


    const addPlacemarkCoordinates = (e) => {
        openPanelControl();
        const position = e.get('coords');
        setNewPlacemarkCoordinates(position)
    }

    const addPlacemark = (coordinates, country, city, title, description, workTime, rating, social) => {
        let newPlacemark = {
            coordinate: coordinates,
            country: country,
            city: city,
            logo: null,
            title: title,
            description: description,
            workTime: workTime,
            rating: {
                star: 5
            },
            social: [
                {vk: ''},
                {fb: ''},
                {ig: ''}
            ]
        }
        let newArray = [...placemarkObjects, newPlacemark]
        setPlacemarkObjects(newArray);
        setStartStateMapZoom({center: map.getCenter(), zoom: 3})

    }


    return (
        <YMaps enterprise
               query={{apikey: '1c7f4567-d722-4829-8b8c-6dae4d41a40c'}}>
            <LeftCards/>
            <Map state={startStateMapZoom}
                 className={`${style.container} ${style.yMaps_layers_pane}`}
                 instanceRef={(map) => setMap(map)}
                 onContextMenu={addPlacemarkCoordinates}

            >

                <Clusterer
                    options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}>

                    {/* applied placemarks */}
                    {placemarkObjects.map((point, index) => <Placemark key={index}
                                                                       geometry={point.coordinate}
                                                                       onClick={clickPlacemark}/>)}

                </Clusterer>
                {/* control buttons */}
                <ZoomControl options={{float: 'right'}}/>
                <GeolocationControl options={{float: 'left'}}/>
                <SearchControl options={{float: 'right'}}/>
            </Map>
            <AddPlacemarkForm
                panelOpen={panelOpen}
                openPanelControl={setPanelOpen}
                addPlacemark={addPlacemark}
                newPlacemarkCoordinates={newPlacemarkCoordinates}
                setNewPlacemarkCoordinates = {setNewPlacemarkCoordinates}

            />
        </YMaps>
    )
}