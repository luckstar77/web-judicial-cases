import React, { useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ProjectionConfig,
    Marker,
    ZoomableGroup,
    Annotation,
} from 'react-simple-maps';
import taiwan from '../asset/taiwanCountry.json';
interface CountyCoordinates {
    [key: string]: [number, number];
}
export default function MapChart() {
    const [hoveredCity, setHoveredCity] = useState(null);
    const projectionConfig: ProjectionConfig = {
        center: [120.9795, 23.9783],
        scale: 6000,
    };
    const [tooltipContent, setTooltipContent] = useState('');

    const cityData = [
        { name: '基隆市', rent: { '2021': 6.2, '2020': 6.1 } },
        { name: '臺北市', rent: { '2021': 8.7, '2020': 8.5 } },
        { name: '新北市', rent: { '2021': 5.8, '2020': 5.7 } },
        { name: '桃園市', rent: { '2021': 4.4, '2020': 4.3 } },
        { name: '新竹市', rent: { '2021': 5.1, '2020': 5.0 } },
        { name: '新竹縣', rent: { '2021': 3.4, '2020': 3.3 } },
        { name: '苗栗縣', rent: { '2021': 2.9, '2020': 2.8 } },
        { name: '臺中市', rent: { '2021': 3.5, '2020': 3.4 } },
        { name: '彰化縣', rent: { '2021': 2.4, '2020': 2.3 } },
        { name: '南投縣', rent: { '2021': 2.1, '2020': 2.0 } },
        { name: '雲林縣', rent: { '2021': 2.1, '2020': 2.0 } },
        { name: '嘉義市', rent: { '2021': 2.8, '2020': 2.7 } },
        { name: '嘉義縣', rent: { '2021': 2.3, '2020': 2.2 } },
        { name: '臺南市', rent: { '2021': 3.1, '2020': 3.0 } },
        { name: '高雄市', rent: { '2021': 3.1, '2020': 3.0 } },
        { name: '屏東縣', rent: { '2021': 1.9, '2020': 1.8 } },
        { name: '宜蘭縣', rent: { '2021': 3.4, '2020': 3.3 } },
    ];
    const countyCoordinates: CountyCoordinates = {
        宜蘭縣: [121.746248, 24.696762],
        新北市: [121.4648, 25.01039],
        新竹市: [120.9647, 24.80395],
        新竹縣: [121.125213, 24.70328],
        台中市: [120.9417, 24.23321],
        台北市: [121.5651704, 25.0377984],
        台南市: [120.251272, 23.141698],
        台東縣: [121.1508, 22.755358],
        嘉義市: [120.4525, 23.4815],
        嘉義縣: [120.5740002, 23.4586871],
        基隆市: [121.7081, 25.10898],
        境外船艦: [114.16546, 22.277862],
        屏東縣: [120.62, 22.54951],
        彰化縣: [120.4818, 24.068523],
        桃園市: [121.215078, 24.928738],
        澎湖縣: [119.566417, 23.569733],
        花蓮縣: [121.354163, 23.756894],
        雲林縣: [120.3897, 23.75585],
        高雄市: [120.311922, 22.620856],
        金門縣: [118.318584, 24.436774],
        連江縣: [119.539704, 26.197364],
        南投縣: [120.987632, 23.83876],
    };
    return (
        <ComposableMap
            projection="geoMercator"
            projectionConfig={projectionConfig}
        >
            <ZoomableGroup center={[121, 23.5]}>
                <Geographies geography={taiwan}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#ddd"
                                stroke="#000"
                                strokeWidth={0.5}
                                onMouseEnter={() => {
                                    setTooltipContent(
                                        `${geo.properties.NAME_2014}`
                                    );
                                    setHoveredCity(geo.properties.NAME_2014);
                                }}
                                onMouseLeave={() => setHoveredCity(null)}
                                style={{
                                    default: {
                                        fill: '#ddd',
                                        outline: 'none',
                                    },
                                    hover: {
                                        fill: '#f5f5f5',
                                        outline: 'none',
                                    },
                                }}
                            />
                        ))
                    }
                </Geographies>
                {hoveredCity && (
                    <text x={400} y={400} textAnchor="middle">
                        {hoveredCity}
                    </text>
                )}
                {/* <div>
                    {cityData.map((city) => (
                        <Annotation
                            key={city.name}
                            subject={countyCoordinates[city.name]}
                            dx={-50}
                            dy={20}
                            connectorProps={{ stroke: 'black', strokeWidth: 1 }}
                            style={{ fontSize: '0.8rem' }}
                        >
                            <div>{city.name}</div>
                            <div>2019 年租金十分位數：{city.rent['2021']}</div>
                            <div>2020 年租金十分位數：{city.rent['2020']}</div>
                        </Annotation>
                    ))}
                </div> */}
            </ZoomableGroup>
        </ComposableMap>
    );
}
