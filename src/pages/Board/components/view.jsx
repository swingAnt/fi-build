
import style from "./free.module.scss"
import { getDragData, draftEvent, getUuid } from "@/utils";
import { useAtom, atom, useAtomValue, useSetAtom, } from 'jotai'
import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import { Pie, Bar, Radar, Sunburst } from './charts'
import 'bbb'
import darkTheme from '@/assets/theme/dark.json';
import vintageTheme from '@/assets/theme/vintage.json';
import wonderlandTheme from '@/assets/theme/wonderland.json';
import * as echarts from 'echarts';
echarts.registerTheme('dark', darkTheme);
echarts.registerTheme('vintage', vintageTheme);
echarts.registerTheme('wonderland', wonderlandTheme);
const View = (props) => {
    const { type, name,themeType } = props

    const getChar = () => {
        if ('chart' === name) {
            const map = {
                "pie": <Pie
                themeType={themeType}
                echarts={echarts}
                ></Pie>,
                "bar": <Bar
                themeType={themeType}
                echarts={echarts}

                ></Bar>,
                "radar": <Radar
                themeType={themeType}
                echarts={echarts}

                ></Radar>,
                "sunburst": <Sunburst
                themeType={themeType}
                echarts={echarts}
                ></Sunburst>


            }
            return map[type] || ""
        }
        const map = {
            "clock": <sw-clock ></sw-clock>,
            "calendar": <sw-calendar ></sw-calendar>,
            "drawing": <sw-drawing width="100%" height="100%"></sw-drawing>,
            "video": <sw-video width="100%" height="100%" url="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" bg="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"></sw-video>

        }
        return map[type] || ""

    }

    return (
        <
            >
            {getChar()}
        </>


    )


}

export default View