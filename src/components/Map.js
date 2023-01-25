import {Fragment, useContext, useEffect, useState} from "react";
import classes from "./Map.module.css";
import waterMap from "../assets/watermap.json";
import Modal from "./UI/Modal";
import ChartContext from "../store/chart-context";

const { kakao } = window;

const Map = props => {
    let waterMapPolygon = JSON.parse(JSON.stringify(waterMap));
    // console.log(waterMapPolygon);
    // console.log(waterMapPolygon.features[0].geometry.coordinates[0][0][0], waterMapPolygon.features[0].geometry.coordinates[0][0][1]);
    const [isModal, setIsModal] = useState(false);
    const chartCtx = useContext(ChartContext);

    const showModalTrigger = () => {
        setIsModal(true);
    }
    const hideModalTrigger = () => {
        setIsModal(false);
    }


    useEffect(() => {
        // 객체 만드는 과정
        var areas = [];
        const bigWaterMap = [];
        // console.log(waterMapPolygon);

        // 각 물 지도 구역 (0~73)
        for(let i=0; i<waterMapPolygon.features.length;i++){
            // 각 구역별 (0~73) lat, lng 뽑아내기
            const areaInfo = new Object({name:"",path:[]});
            if(waterMapPolygon.features[i].geometry.coordinates.length === 1){
                areaInfo.name = waterMapPolygon.features[i].properties.SBSNNM;
                const sectionWaterMap = [];
                for(let j=0; j<waterMapPolygon.features[i].geometry.coordinates[0].length; j++){
                    sectionWaterMap.push(new kakao.maps.LatLng(waterMapPolygon.features[i].geometry.coordinates[0][j][1], waterMapPolygon.features[i].geometry.coordinates[0][j][0]));
                }
                areaInfo.path = sectionWaterMap;
                // areaInfo.push(name, sectionWaterMap);
                // console.log(sectionWaterMap);
                // console.log(bigWaterMap);
                areas.push(areaInfo);
            }
        }
        // console.log(areas);
        // 객체 다 만듦.


        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(35.1359, 127.2531),
            level: 10,
        };
        let map = new kakao.maps.Map(container, options);
        let customOverlay = new kakao.maps.CustomOverlay({});
        let infowindow = new kakao.maps.InfoWindow({removable: true});

        // 지도에 영역데이터를 폴리곤으로 표시합니다
        for (var i = 0, len = areas.length; i < len; i++) {
            displayArea(areas[i]);
        }

        function displayArea (area) {
            var polygon = new kakao.maps.Polygon({
                map:map,
                path:area.path,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: '#fff',
                fillOpacity: 0.7
            });
            // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
            // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
            kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
                polygon.setOptions({fillColor: '#09f'});

                customOverlay.setContent('<div class="area">' + area.name + '</div>');

                customOverlay.setPosition(mouseEvent.latLng);
                customOverlay.setMap(map);
            });

            // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
            kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
                customOverlay.setPosition(mouseEvent.latLng);
            });

            // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
            // 커스텀 오버레이를 지도에서 제거합니다
            kakao.maps.event.addListener(polygon, 'mouseout', function() {
                polygon.setOptions({fillColor: '#fff'});
                customOverlay.setMap(null);
            });

            // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
            kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
                // var content = '<div class="info">' +
                //     '   <div class="title">' + area.name + '</div>' +
                //     '   <div class="size">총 면적 : 약 ' + Math.floor(polygon.getArea()) + ' m<sup>2</sup></div>' +
                //     '</div>';
                // infowindow.setContent(content);
                // infowindow.setPosition(mouseEvent.latLng);
                // infowindow.setMap(map);
                setIsModal(true);
                chartCtx.name = area.name;
            });
        }

    }, [chartCtx]);

    return(
        <Fragment>
            {isModal&&<Modal onClose={hideModalTrigger}/>}
            <div className={classes.mapCntnr} id="map">
            </div>
        </Fragment>
    )
}
export default Map;